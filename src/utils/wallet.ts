// Utility functions for interacting with OKX wallet

/**
 * Formats an address to a shortened form (e.g., 0x1234...5678)
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Converts wei to ETH (division by 10^18)
 */
export const weiToEth = (wei: string): number => {
  return parseInt(wei, 16) / 1e18;
};

/**
 * ERC20 Token ABI (minimal for balanceOf)
 */
export const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  }
];

/**
 * Common token addresses on Ethereum
 */
export const TOKEN_ADDRESSES = {
  // Mainnet
  ETH: 'native',
  BTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
  OKB: '0x75231F58b43240C9718Dd58B4967c5114342a86c', // OKB token
  BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', // BNB token
  SOL: '0xD31a59c85aE9D8edEFeC411D448f90841571b89c', // Wrapped SOL on ETH
};

/**
 * Gets token balance for an ERC20 token
 */
export const getTokenBalance = async (
  tokenAddress: string, 
  walletAddress: string,
  okxWallet: any
): Promise<number> => {
  if (!okxWallet || !walletAddress || !tokenAddress) return 0;
  
  try {
    // Native ETH balance
    if (tokenAddress === 'native') {
      const balance = await okxWallet.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest']
      });
      return weiToEth(balance);
    }
    
    // ERC20 token balance
    const data = {
      method: 'eth_call',
      params: [
        {
          to: tokenAddress,
          data: `0x70a08231000000000000000000000000${walletAddress.replace('0x', '')}`
        },
        'latest'
      ]
    };
    
    const hexBalance = await okxWallet.request(data);
    
    // Get token decimals
    const decimalData = {
      method: 'eth_call',
      params: [
        {
          to: tokenAddress,
          data: '0x313ce567' // decimals function signature
        },
        'latest'
      ]
    };
    
    const hexDecimals = await okxWallet.request(decimalData);
    const decimals = parseInt(hexDecimals, 16);
    
    // Convert balance based on decimals
    return parseInt(hexBalance, 16) / Math.pow(10, decimals);
  } catch (error) {
    console.error(`Error fetching balance for token ${tokenAddress}:`, error);
    return 0;
  }
};

/**
 * Gets all relevant token balances for the portfolio
 */
export const getPortfolioBalances = async (walletAddress: string, okxWallet: any) => {
  try {
    const balances = await Promise.all(
      Object.entries(TOKEN_ADDRESSES).map(async ([symbol, address]) => {
        const balance = await getTokenBalance(address, walletAddress, okxWallet);
        return { symbol, balance };
      })
    );
    
    return balances.reduce((acc, { symbol, balance }) => {
      acc[symbol] = balance;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error fetching portfolio balances:', error);
    return {};
  }
};

/**
 * Fetches market data from OKX API
 */
import { fetchMarketData } from '@/api/okxMarketData';

export const getMarketData = async (symbols: string[]) => {
  try {
    // Use our API client to fetch data directly from OKX
    const data = await fetchMarketData(symbols);
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
};
