
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { coins } = await req.json()
    
    if (!coins || !Array.isArray(coins)) {
      return new Response(
        JSON.stringify({ error: 'Coins array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const coinIds = coins.join(',')
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true`
    )
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    
    const formattedData = Object.entries(data).map(([coinId, priceData]: [string, any]) => ({
      symbol: coinId.toUpperCase(),
      price: priceData.usd,
      change24h: priceData.usd_24h_change?.toFixed(2) || '0.00',
      volume24h: priceData.usd_24h_vol || 0,
      timestamp: priceData.last_updated_at * 1000,
      exchange: 'CoinGecko'
    }))

    console.log('CoinGecko API response:', formattedData)

    return new Response(
      JSON.stringify({ data: formattedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('CoinGecko API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch CoinGecko price data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
