
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import TradingPreferences, { TradingPreferenceValues } from '@/components/trading/TradingPreferences';

// No longer needed

const Landing = () => {
  const navigate = useNavigate();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if OKX wallet is available
  const isOKXWalletAvailable = () => {
    return typeof window !== 'undefined' && window.okxwallet !== undefined;
  };

  // Connect to OKX wallet
  const connectOKXWallet = async () => {
    try {
      setIsConnecting(true);
      
      if (!isOKXWalletAvailable()) {
        window.open('https://www.okx.com/web3/wallet', '_blank');
        return;
      }

      const accounts = await window.okxwallet.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        console.log('Connected to OKX wallet:', accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting to OKX wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from OKX wallet
  const disconnectWallet = async () => {
    try {
      // If OKX wallet is available, attempt to disconnect using its API
      if (isOKXWalletAvailable() && window.okxwallet) {
        // Remove any listeners that might have been set up
        if (window.okxwallet.removeListener) {
          window.okxwallet.removeListener('accountsChanged', () => {});
          window.okxwallet.removeListener('chainChanged', () => {});
          window.okxwallet.removeListener('disconnect', () => {});
        }
        
        // Some wallets have a specific disconnect method, try it if available
        if (window.okxwallet.disconnect && typeof window.okxwallet.disconnect === 'function') {
          await window.okxwallet.disconnect();
        }
        
        console.log('Disconnected from OKX wallet');
      }
    } catch (error) {
      console.error('Error disconnecting from OKX wallet:', error);
    } finally {
      // Always update the UI state regardless of success/failure of API calls
      setIsWalletConnected(false);
      setWalletAddress('');
    }
  };

  // Function to analyze user preferences and recommend strategies
  const analyzeUserPreferences = (preferences: TradingPreferenceValues): number[] => {
    // Default recommendations if analysis fails
    const defaultRecommendations = [1, 2, 3];
    
    try {
      // Map risk tolerance to strategy risk levels
      let riskLevel = '';
      if (preferences.riskTolerance === 'conservative') riskLevel = 'Low';
      else if (preferences.riskTolerance === 'moderate') riskLevel = 'Medium';
      else if (preferences.riskTolerance === 'aggressive') riskLevel = 'High';
      
      // Map timeframe to strategy timeframes
      let tradingStyle = '';
      if (preferences.tradingTimeframe === 'scalping') tradingStyle = 'Scalping';
      else if (preferences.tradingTimeframe === 'day') tradingStyle = 'Day Trading';
      else if (preferences.tradingTimeframe === 'swing') tradingStyle = 'Swing Trading';
      
      // Map crypto preference
      let cryptoType = preferences.cryptoPreference;
      cryptoType = cryptoType.charAt(0).toUpperCase() + cryptoType.slice(1);
      if (cryptoType === 'okx') cryptoType = 'OKX';
      if (cryptoType === 'binance') cryptoType = 'Binance';
      
      // Scoring system for strategies based on user preferences
      const strategyScores: {[key: number]: number} = {};
      
      // This would typically be imported from a database or API
      const strategyProfiles = [
        { id: 1, risk: 'Low', styles: ['Swing Trading', 'Day Trading'], cryptos: ['Bitcoin', 'OKX'], tags: ['Beginner-friendly'] },
        { id: 2, risk: 'Medium', styles: ['Scalping', 'Day Trading'], cryptos: ['Ethereum', 'OKX'], tags: ['Technical indicators'] },
        { id: 3, risk: 'High', styles: ['Day Trading'], cryptos: ['OKX', 'Binance'], tags: ['Machine learning'] },
        { id: 4, risk: 'Low', styles: ['Swing Trading'], cryptos: ['Bitcoin', 'Binance'], tags: ['Passive'] },
        { id: 5, risk: 'Medium', styles: ['Day Trading'], cryptos: ['Ethereum', 'OKX'], tags: ['Technical analysis'] },
        { id: 6, risk: 'Medium', styles: ['Swing Trading'], cryptos: ['Bitcoin', 'Binance'], tags: ['Trend-following'] },
        { id: 7, risk: 'Medium', styles: ['Swing Trading'], cryptos: ['Ethereum', 'Binance'], tags: ['Trend analysis'] },
        { id: 8, risk: 'High', styles: ['Day Trading'], cryptos: ['Solana', 'OKX'], tags: ['Breakout'] },
        { id: 9, risk: 'High', styles: ['Swing Trading'], cryptos: ['OKX', 'Binance'], tags: ['Sentiment analysis'] },
        { id: 10, risk: 'High', styles: ['Scalping'], cryptos: ['Ethereum', 'OKX'], tags: ['DeFi'] }
      ];
      
      // Score each strategy based on match with user preferences
      strategyProfiles.forEach(strategy => {
        let score = 0;
        
        // Risk match (most important)
        if (strategy.risk === riskLevel) score += 5;
        else if (
          (riskLevel === 'Low' && strategy.risk === 'Medium') || 
          (riskLevel === 'Medium' && (strategy.risk === 'Low' || strategy.risk === 'High'))
        ) score += 2; // Adjacent risk levels get partial points
        
        // Trading style match
        if (strategy.styles.includes(tradingStyle)) score += 4;
        
        // Crypto preference match
        if (strategy.cryptos.includes(cryptoType)) score += 3;
        
        // Expected return consideration
        if (preferences.expectedReturn > 25 && strategy.risk === 'High') score += 2;
        else if (preferences.expectedReturn > 15 && preferences.expectedReturn <= 25 && strategy.risk === 'Medium') score += 2;
        else if (preferences.expectedReturn <= 15 && strategy.risk === 'Low') score += 2;
        
        // Win rate consideration
        if (preferences.winRate > 80 && ['Low', 'Medium'].includes(strategy.risk)) score += 1;
        else if (preferences.winRate > 65 && preferences.winRate <= 80) score += 1;
        else if (preferences.winRate <= 65 && strategy.risk === 'High') score += 1;
        
        strategyScores[strategy.id] = score;
      });
      
      // Sort strategies by score and return top 3
      const sortedStrategies = Object.entries(strategyScores)
        .sort((a, b) => b[1] - a[1])
        .map(entry => parseInt(entry[0]));
      
      return sortedStrategies.slice(0, 3);
    } catch (error) {
      console.error('Error analyzing preferences:', error);
      return defaultRecommendations;
    }
  };

  const handleRecommend = (preferences: TradingPreferenceValues) => {
    const recommendedStrategyIds = analyzeUserPreferences(preferences);
    navigate('/recommendations', { 
      state: { recommendedStrategyIds } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 relative">
      {/* Wallet Connection Button - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isWalletConnected ? (
          <>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-black px-4 py-2 rounded-lg flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
            </div>
            <Button 
              onClick={disconnectWallet}
              className="bg-red-500 hover:bg-red-600 text-white hover:shadow-lg px-4 py-2 rounded-lg"
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button 
            onClick={connectOKXWallet}
            disabled={isConnecting}
            className="bg-gradient-to-r from-neon-cyan to-neon-green text-black hover:shadow-lg px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? 'Connecting...' : 'Connect OKX Wallet'}
          </Button>
        )}
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-neon-cyan to-neon-green rounded-2xl flex items-center justify-center glass-morphism">
              <Bot className="w-10 h-10 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-green to-neon-purple">
            Arbitra: Choose Your Own Crypto Trading Bot
          </h1>
          <p className="text-lg text-gray-400">
            Set your trading preferences and let the AI recommend the best strategies
          </p>
        </div>

        {/* Two Column Layout - Portfolio Dashboard and Trading Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Portfolio Dashboard */}
          <div>
            <PortfolioDashboard 
              isWalletConnected={isWalletConnected} 
              walletAddress={walletAddress} 
              onConnectWallet={connectOKXWallet} 
            />
          </div>
          
          {/* Right Column - Trading Preferences */}
          <div>
            <TradingPreferences onRecommend={handleRecommend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
