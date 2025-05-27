// API client for OKX market data

/**
 * Fetches current market data from OKX API for specified trading pairs
 * @param symbols Array of token symbols (e.g., ['BTC', 'ETH'])
 * @returns Market data with prices and 24h changes
 */
export const fetchMarketData = async (symbols: string[]) => {
  try {
    // Convert symbols to OKX trading pairs format
    const tradingPairs = symbols.map(symbol => `${symbol}-USDT`).join(',');
    
    // Direct API call to OKX
    const response = await fetch(`https://www.okx.com/api/v5/market/tickers?instType=SPOT&instId=${tradingPairs}`);
    
    if (!response.ok) {
      throw new Error(`OKX API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format the response
    return data.data.map((ticker: any) => {
      const symbol = ticker.instId.split('-')[0]; // Extract token from pair (e.g., BTC-USDT -> BTC)
      
      return {
        symbol: ticker.instId,
        price: parseFloat(ticker.last),
        change24h: ((parseFloat(ticker.last) - parseFloat(ticker.open24h)) / parseFloat(ticker.open24h) * 100).toFixed(2),
        volume24h: parseFloat(ticker.vol24h),
        high24h: parseFloat(ticker.high24h),
        low24h: parseFloat(ticker.low24h),
        timestamp: parseInt(ticker.ts),
        exchange: 'OKX'
      };
    });
  } catch (error) {
    console.error('OKX API error:', error);
    throw error;
  }
};
