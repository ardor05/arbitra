
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OKXTicker {
  instId: string
  last: string
  lastSz: string
  askPx: string
  askSz: string
  bidPx: string
  bidSz: string
  open24h: string
  high24h: string
  low24h: string
  vol24h: string
  ts: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbols } = await req.json()
    
    if (!symbols || !Array.isArray(symbols)) {
      return new Response(
        JSON.stringify({ error: 'Symbols array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const instIds = symbols.join(',')
    const response = await fetch(`https://www.okx.com/api/v5/market/tickers?instType=SPOT&instId=${instIds}`)
    
    if (!response.ok) {
      throw new Error(`OKX API error: ${response.status}`)
    }

    const data = await response.json()
    
    const formattedData = data.data.map((ticker: OKXTicker) => ({
      symbol: ticker.instId,
      price: parseFloat(ticker.last),
      change24h: ((parseFloat(ticker.last) - parseFloat(ticker.open24h)) / parseFloat(ticker.open24h) * 100).toFixed(2),
      volume24h: parseFloat(ticker.vol24h),
      high24h: parseFloat(ticker.high24h),
      low24h: parseFloat(ticker.low24h),
      timestamp: parseInt(ticker.ts),
      exchange: 'OKX'
    }))

    console.log('OKX API response:', formattedData)

    return new Response(
      JSON.stringify({ data: formattedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('OKX API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch OKX market data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
