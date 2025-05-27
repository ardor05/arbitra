
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { assets } = await req.json()
    
    if (!assets || !Array.isArray(assets)) {
      return new Response(
        JSON.stringify({ error: 'Assets array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = await Promise.allSettled([
      // OKX prices for crypto pairs
      supabase.functions.invoke('okx-market-data', {
        body: { symbols: ['BTC-USDT', 'ETH-USDT', 'SOL-USDT'] }
      }),
      // CoinGecko prices
      supabase.functions.invoke('coingecko-prices', {
        body: { coins: ['bitcoin', 'ethereum', 'solana'] }
      }),
      // Jupiter prices for Solana tokens
      supabase.functions.invoke('jupiter-prices', {
        body: { tokens: ['So11111111111111111111111111111111111111112'] } // SOL token
      })
    ])

    const aggregatedData: any[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.data) {
        const response = result.value.data
        if (response.data) {
          aggregatedData.push(...response.data)
        }
      } else {
        console.error(`API ${index} failed:`, result.status === 'rejected' ? result.reason : 'Unknown error')
      }
    })

    // Group by symbol and calculate averages
    const priceMap = new Map()
    aggregatedData.forEach(item => {
      const symbol = item.symbol.replace('-USDT', '').replace('-USD', '')
      if (!priceMap.has(symbol)) {
        priceMap.set(symbol, [])
      }
      priceMap.get(symbol).push(item)
    })

    const finalData = Array.from(priceMap.entries()).map(([symbol, prices]: [string, any[]]) => {
      const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length
      const exchanges = prices.map(p => p.exchange)
      
      return {
        symbol,
        price: avgPrice,
        change24h: prices[0]?.change24h || '0.00',
        volume24h: prices[0]?.volume24h || 0,
        exchanges,
        pricesByExchange: prices.reduce((acc, p) => {
          acc[p.exchange] = p.price
          return acc
        }, {}),
        timestamp: Date.now()
      }
    })

    console.log('Aggregated price data:', finalData)

    return new Response(
      JSON.stringify({ data: finalData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Price aggregator error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to aggregate price data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
