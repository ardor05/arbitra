// API client for OKX historical candle data

/**
 * Fetches historical candle data from OKX API for a specific trading pair
 * @param symbol Token symbol (e.g., 'BTC', 'ETH')
 * @param timeframe Candle timeframe (e.g., '1m', '5m', '15m', '1H', '4H', '1D')
 * @param limit Number of candles to fetch (max 100)
 * @returns Array of candle data with OHLCV (Open, High, Low, Close, Volume)
 */
export const fetchCandleData = async (symbol: string, timeframe: string = '15m', limit: number = 100) => {
  try {
    // Convert symbol to OKX trading pair format
    const tradingPair = `${symbol}-USDT`;
    
    // Direct API call to OKX for historical candle data
    const response = await fetch(`https://www.okx.com/api/v5/market/candles?instId=${tradingPair}&bar=${timeframe}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`OKX API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from OKX API');
    }
    
    // Format the response - OKX returns candles in reverse order (newest first)
    // We reverse it to get oldest first for chart rendering
    return data.data.map((candle: any) => {
      const [timestamp, open, high, low, close, volume] = candle;
      
      return {
        time: parseInt(timestamp),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
      };
    }).reverse(); // Reverse to get oldest first
  } catch (error) {
    console.error('OKX API error fetching candle data:', error);
    // Return empty array instead of throwing to handle gracefully in UI
    return [];
  }
};

/**
 * Gets the correct timeframe parameter for OKX API based on user-friendly input
 * @param interval User-friendly interval (e.g., '15m', '1h', '4h', '1d')
 * @returns Formatted timeframe for OKX API
 */
export const getOkxTimeframe = (interval: string): string => {
  const mapping: {[key: string]: string} = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '30m': '30m',
    '1h': '1H',
    '2h': '2H',
    '4h': '4H',
    '6h': '6H',
    '12h': '12H',
    '1d': '1D',
    '1w': '1W',
    '1M': '1M'
  };
  
  return mapping[interval.toLowerCase()] || '15m'; // Default to 15m if not found
};
