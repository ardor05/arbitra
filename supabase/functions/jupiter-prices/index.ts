
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
    const { tokens } = await req.json()
    
    if (!tokens || !Array.isArray(tokens)) {
      return new Response(
        JSON.stringify({ error: 'Tokens array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tokenIds = tokens.join(',')
    const response = await fetch(`https://price.jup.ag/v4/price?ids=${tokenIds}`)
    
    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`)
    }

    const data = await response.json()
    
    const formattedData = Object.entries(data.data).map(([tokenId, priceData]: [string, any]) => ({
      symbol: tokenId,
      price: priceData.price,
      change24h: ((priceData.price - priceData.price) / priceData.price * 100).toFixed(2), // Jupiter doesn't provide 24h change
      timestamp: Date.now(),
      exchange: 'Jupiter'
    }))

    console.log('Jupiter API response:', formattedData)

    return new Response(
      JSON.stringify({ data: formattedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Jupiter API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Jupiter price data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
