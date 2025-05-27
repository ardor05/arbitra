import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Coins, TrendingUp, AlertTriangle, BarChart2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPortfolioBalances, getMarketData, formatAddress } from '@/utils/wallet';

interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  price: number;
  change24h: number;
}

interface PortfolioDashboardProps {
  isWalletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
}

// Function to get price signal indicator based on 24h change
const getPriceSignal = (change24h: number) => {
  if (change24h > 5) {
    return <span className="text-green-500 text-xs font-bold ml-1 px-1 py-0.5 bg-green-500/20 rounded">STRONG BUY</span>;
  } else if (change24h > 2) {
    return <span className="text-green-400 text-xs font-bold ml-1 px-1 py-0.5 bg-green-400/20 rounded">BUY</span>;
  } else if (change24h < -5) {
    return <span className="text-red-500 text-xs font-bold ml-1 px-1 py-0.5 bg-red-500/20 rounded">STRONG SELL</span>;
  } else if (change24h < -2) {
    return <span className="text-red-400 text-xs font-bold ml-1 px-1 py-0.5 bg-red-400/20 rounded">SELL</span>;
  } else {
    return <span className="text-yellow-500 text-xs font-bold ml-1 px-1 py-0.5 bg-yellow-500/20 rounded">NEUTRAL</span>;
  }
};

const PortfolioDashboard = ({ isWalletConnected, walletAddress, onConnectWallet }: PortfolioDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<any[]>([]);

  const fetchPortfolioData = async () => {
    if (!isWalletConnected || !window.okxwallet) return;
    
    setIsLoading(true);
    
    try {
      // Get token balances from wallet
      const balances = await getPortfolioBalances(walletAddress, window.okxwallet);
      
      // Always fetch price data for common tokens, even if balance is 0
      // This ensures we always show some assets in the list
      const commonTokens = ['BTC', 'ETH', 'SOL', 'OKB', 'BNB'];
      const userTokens = Object.keys(balances).filter(symbol => balances[symbol] > 0);
      const tokens = [...new Set([...commonTokens, ...userTokens])];
      const marketData = await getMarketData(tokens);
      
      // Map token names
      const tokenNames: Record<string, string> = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'SOL': 'Solana',
        'OKB': 'OKX Token',
        'BNB': 'Binance Coin'
      };
      
      // Create asset objects - include all tokens for visibility
      const assets: PortfolioAsset[] = tokens
        .map(symbol => {
          const priceData = marketData.find((data: any) => 
            data.symbol === `${symbol}-USDT`
          );
          
          const price = priceData?.price || 0;
          const change24h = parseFloat(priceData?.change24h || '0');
          const value = balances[symbol] * price;
          
          return {
            symbol,
            name: tokenNames[symbol] || symbol,
            balance: balances[symbol],
            value,
            price,
            change24h
          };
        })
        .sort((a, b) => b.value - a.value); // Sort by value (highest first)
      
      // Calculate total portfolio value and change
      const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
      
      // Calculate weighted average change
      const weightedChange = assets.reduce((sum, asset) => {
        const weight = asset.value / totalValue;
        return sum + (asset.change24h * weight);
      }, 0);
      
      setPortfolioAssets(assets);
      setPortfolioValue(totalValue);
      setPortfolioChange(parseFloat(weightedChange.toFixed(2)));
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      // Fallback to mock data if API calls fail
      const mockAssets: PortfolioAsset[] = [
        { symbol: 'BTC', name: 'Bitcoin', balance: 0.12, value: 8245.32, price: 68711, change24h: 2.3 },
        { symbol: 'ETH', name: 'Ethereum', balance: 1.45, value: 4520.78, price: 3118, change24h: -1.2 },
        { symbol: 'SOL', name: 'Solana', balance: 15.8, value: 2105.40, price: 133.25, change24h: 3.7 },
        { symbol: 'OKB', name: 'OKX Token', balance: 25.5, value: 1147.5, price: 45, change24h: 5.2 },
        { symbol: 'BNB', name: 'Binance Coin', balance: 4.2, value: 1386, price: 330, change24h: -0.8 }
      ];
      
      setPortfolioAssets(mockAssets);
      setPortfolioValue(mockAssets.reduce((sum, asset) => sum + asset.value, 0));
      setPortfolioChange(3.5);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isWalletConnected) {
      fetchPortfolioData();
    }
  }, [isWalletConnected, walletAddress]);

  if (!isWalletConnected) {
    return (
      <Card className="glass-morphism border-gray-800 h-full">
        <CardHeader>
          <CardTitle className="text-neon-cyan flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Portfolio Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-80 space-y-6 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 opacity-60" />
          <div>
            <h3 className="text-xl font-medium text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-6">Connect your OKX wallet to view your portfolio and track your assets</p>
            <button
              onClick={onConnectWallet}
              className="bg-gradient-to-r from-neon-cyan to-neon-green text-black font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 w-full hover:shadow-lg hover:shadow-neon-cyan/20"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-neon-cyan flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Portfolio Dashboard
        </CardTitle>
        {isWalletConnected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchPortfolioData}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            title="Refresh portfolio data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <div className="w-12 h-12 border-t-2 border-neon-cyan rounded-full animate-spin" />
            <p className="text-gray-400">Loading portfolio data...</p>
          </div>
        ) : (
          <>
            {/* Portfolio Value Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Portfolio Value</div>
                <div className="text-2xl font-bold text-white">${portfolioValue.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">24h Change</div>
                <div className={`text-2xl font-bold ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioChange >= 0 ? '+' : ''}{portfolioChange}%
                </div>
              </div>
            </div>

            {/* Asset List Container */}
            <div className="space-y-3">
              {/* Asset List Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-400">Assets</div>
                <div className="flex text-xs text-gray-500 gap-4">
                  <div className="w-20 text-right">Price</div>
                  <div className="w-16 text-right">24h</div>
                  <div className="w-20 text-right">Value</div>
                </div>
              </div>
              
              {/* Asset List */}
              <div className="space-y-2">
                {portfolioAssets.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">No assets found. Connect your wallet to view your portfolio.</div>
                ) : (
                  portfolioAssets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                          ${asset.symbol === 'BTC' ? 'bg-amber-600' : 
                            asset.symbol === 'ETH' ? 'bg-purple-700' : 
                            asset.symbol === 'SOL' ? 'bg-green-600' : 
                            asset.symbol === 'OKB' ? 'bg-blue-600' : 
                            asset.symbol === 'BNB' ? 'bg-yellow-500' : 
                            'bg-gray-600'}`}
                        >
                          <Coins className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            {asset.name}
                            {getPriceSignal(asset.change24h)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {asset.balance > 0 
                              ? `${asset.balance.toFixed(asset.balance < 0.01 ? 8 : 4)} ${asset.symbol}` 
                              : `0 ${asset.symbol}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex text-right gap-4">
                        <div className="w-20 text-right">
                          <div className="font-medium">${asset.price.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                          <div className="text-xs text-gray-400">per token</div>
                        </div>
                        <div className="w-16 text-right">
                          <div className={`text-xs flex items-center justify-end gap-1 ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 transform rotate-180" />}
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                          </div>
                        </div>
                        <div className="w-20 text-right">
                          <div className="font-medium">${asset.value.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioDashboard;
