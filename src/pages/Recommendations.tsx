
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, TrendingUp, Zap, Target, ArrowRight, Grid, Scale, Workflow, TrendingDown, Braces, ArrowRightLeft, BarChart3, BookMarked, Clock, Plus, ArrowLeft, PlayCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import MockTradingModal from '@/components/MockTradingModal';

interface TradingStrategy {
  id: number;
  name: string;
  summary: string;
  risk: 'Low' | 'Medium' | 'High';
  frequency: string;
  expectedReturn: string;
  winRate: number;
  description: string;
  color: string;
  icon: React.ReactNode;
  tags: string[];
  bestFor: string[];
}

const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [showAllStrategies, setShowAllStrategies] = useState(false);
  const [recommendedStrategyIds, setRecommendedStrategyIds] = useState<number[]>([]);
  const [isMockTradingOpen, setIsMockTradingOpen] = useState(false);

  const strategies: TradingStrategy[] = [
    {
      id: 1,
      name: "Conservative Grid",
      summary: "Low-risk grid trading with stable returns",
      risk: "Low",
      frequency: "Multiple trades daily",
      expectedReturn: "8-12% monthly",
      winRate: 85,
      description: "Sets up multiple buy and sell orders at different price levels, capturing profits from price oscillations in a range-bound market. Uses tight stop-losses and conservative position sizing.",
      color: "neon-green",
      icon: <Grid />,
      tags: ["Beginner-friendly", "Range-bound markets", "Automated"],
      bestFor: ["Conservative", "Bitcoin", "OKX"]
    },
    {
      id: 2,
      name: "Momentum Scalper",
      summary: "High-frequency momentum-based trading",
      risk: "Medium",
      frequency: "50-100 trades daily",
      expectedReturn: "15-25% monthly",
      winRate: 72,
      description: "Captures short-term price movements using RSI, MACD and other momentum indicators. Typically holds positions for minutes to hours, taking advantage of intraday volatility.",
      color: "neon-cyan",
      icon: <Zap />,
      tags: ["High-frequency", "Technical indicators", "Momentum"],
      bestFor: ["Moderate", "Scalping", "Ethereum"]
    },
    {
      id: 3,
      name: "Neural Arbitrage",
      summary: "Cross-exchange arbitrage opportunities",
      risk: "High",
      frequency: "Variable, opportunity-based",
      expectedReturn: "20-35% monthly",
      winRate: 91,
      description: "Exploits price differences across exchanges using neural network prediction models. Takes advantage of temporary price discrepancies between exchanges or trading pairs.",
      color: "neon-purple",
      icon: <ArrowRightLeft />,
      tags: ["Arbitrage", "Machine learning", "Advanced"],
      bestFor: ["Aggressive", "Day Trading", "OKX"]
    },
    {
      id: 4,
      name: "DCA Bot",
      summary: "Automated dollar-cost averaging strategy",
      risk: "Low",
      frequency: "Daily or weekly",
      expectedReturn: "10-15% monthly",
      winRate: 88,
      description: "Automatically buys a fixed dollar amount of crypto at regular intervals, regardless of price. Reduces impact of volatility over time and builds positions gradually.",
      color: "neon-green",
      icon: <Clock />,
      tags: ["Long-term", "Passive", "Accumulation"],
      bestFor: ["Conservative", "Swing Trading", "Bitcoin"]
    },
    {
      id: 5,
      name: "Bollinger Trader",
      summary: "Trading based on Bollinger Bands volatility",
      risk: "Medium",
      frequency: "5-15 trades daily",
      expectedReturn: "12-18% monthly",
      winRate: 76,
      description: "Uses Bollinger Bands to identify overbought/oversold conditions and mean reversion opportunities. Works best in volatile but range-bound markets.",
      color: "neon-cyan",
      icon: <BarChart3 />,
      tags: ["Technical analysis", "Mean-reversion", "Volatility"],
      bestFor: ["Moderate", "Day Trading", "Ethereum"]
    },
    {
      id: 6,
      name: "Fibonacci Retracement",
      summary: "Trading key Fibonacci levels in trends",
      risk: "Medium",
      frequency: "3-10 trades weekly",
      expectedReturn: "10-20% monthly",
      winRate: 68,
      description: "Identifies potential support/resistance levels using Fibonacci retracement levels during trending markets. Excellent for swing trading during strong trends.",
      color: "neon-cyan",
      icon: <Target />,
      tags: ["Technical analysis", "Swing trading", "Trend-following"],
      bestFor: ["Moderate", "Swing Trading", "Bitcoin"]
    },
    {
      id: 7,
      name: "Ichimoku Cloud",
      summary: "Multi-faceted Japanese trading system",
      risk: "Medium",
      frequency: "5-15 trades weekly",
      expectedReturn: "12-22% monthly",
      winRate: 74,
      description: "Utilizes the Ichimoku Cloud indicator to identify trends, momentum, and support/resistance levels all in one system. Effective for identifying high-probability entries.",
      color: "neon-cyan",
      icon: <Workflow />,
      tags: ["Japanese technique", "Multi-indicator", "Trend analysis"],
      bestFor: ["Moderate", "Swing Trading", "Ethereum"]
    },
    {
      id: 8,
      name: "Breakout Hunter",
      summary: "Targeting volatility breakouts with momentum",
      risk: "High",
      frequency: "10-20 trades weekly",
      expectedReturn: "18-30% monthly",
      winRate: 65,
      description: "Focuses on identifying and trading breakouts from consolidation patterns. Uses volume confirmation and targets explosive price movements.",
      color: "neon-purple",
      icon: <TrendingUp />,
      tags: ["Breakout", "Volume analysis", "Pattern recognition"],
      bestFor: ["Aggressive", "Day Trading", "Solana"]
    },
    {
      id: 9,
      name: "Sentiment Trader",
      summary: "Trading based on market sentiment analysis",
      risk: "High",
      frequency: "3-8 trades weekly",
      expectedReturn: "15-25% monthly",
      winRate: 62,
      description: "Uses social media sentiment analysis, fear & greed index, and on-chain metrics to identify market extremes and potential reversals.",
      color: "neon-purple",
      icon: <Scale />,
      tags: ["Sentiment analysis", "Contrarian", "Social indicators"],
      bestFor: ["Aggressive", "Swing Trading", "Binance"]
    },
    {
      id: 10,
      name: "MEV Bot",
      summary: "Maximal extractable value opportunities",
      risk: "High",
      frequency: "Variable, opportunity-based",
      expectedReturn: "25-40% monthly",
      winRate: 82,
      description: "Specialized bot that captures value from transaction ordering, arbitrage, and liquidity opportunities in DeFi protocols. Requires advanced technical knowledge.",
      color: "neon-purple",
      icon: <Braces />,
      tags: ["DeFi", "Smart contracts", "Arbitrage"],
      bestFor: ["Aggressive", "Scalping", "OKX"]
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-neon-green border-neon-green bg-neon-green/10';
      case 'Medium': return 'text-neon-cyan border-neon-cyan bg-neon-cyan/10';
      case 'High': return 'text-neon-purple border-neon-purple bg-neon-purple/10';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  useEffect(() => {
    // Check if recommendations were passed from the Landing page
    if (location.state?.recommendedStrategyIds) {
      setRecommendedStrategyIds(location.state.recommendedStrategyIds);
      // Auto-select the first recommended strategy
      if (location.state.recommendedStrategyIds.length > 0) {
        setSelectedStrategy(location.state.recommendedStrategyIds[0]);
      }
    } else {
      // Default to first 3 strategies if no recommendations
      setRecommendedStrategyIds([1, 2, 3]);
    }
  }, [location.state]);

  const handleContinue = () => {
    if (selectedStrategy) {
      // Open the mock trading modal instead of navigating
      setIsMockTradingOpen(true);
    }
  };

  const handleShowMoreStrategies = () => {
    setShowAllStrategies(true);
  };

  // Filter strategies based on whether to show all or just recommended
  const displayedStrategies = showAllStrategies 
    ? strategies 
    : strategies.filter(strategy => recommendedStrategyIds.includes(strategy.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      {/* Mock Trading Modal */}
      {selectedStrategy && (
        <MockTradingModal 
          isOpen={isMockTradingOpen}
          onClose={() => setIsMockTradingOpen(false)}
          strategy={strategies.find(s => s.id === selectedStrategy)}
        />
      )}
      
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button 
          onClick={() => navigate('/')}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
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
            Strategy Recommendations
          </h1>
          <p className="text-lg text-gray-400">
            {showAllStrategies 
              ? 'Explore all available trading strategies'
              : 'Based on your preferences, here are your recommended trading strategies'}
          </p>
        </div>

        {/* Strategy Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displayedStrategies.map((strategy) => (
            <Card 
              key={strategy.id} 
              className={`glass-morphism border-gray-800 hover:border-gray-600 transition-all duration-300 cursor-pointer ${
                selectedStrategy === strategy.id ? `border-${strategy.color} glow-effect` : ''
              }`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 text-${strategy.color}`}>
                    {strategy.icon}
                  </div>
                  <Badge variant="outline" className={getRiskColor(strategy.risk)}>
                    {strategy.risk} Risk
                  </Badge>
                </div>
                <CardTitle className={`text-${strategy.color} neon-text`}>
                  {strategy.name}
                </CardTitle>
                <p className="text-gray-400 text-sm">{strategy.summary}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Frequency</span>
                    <span className="text-sm text-white">{strategy.frequency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Expected Return</span>
                    <span className={`text-sm font-bold text-${strategy.color}`}>{strategy.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Win Rate</span>
                    <span className="text-sm font-bold text-neon-green">{strategy.winRate}%</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400">{strategy.description}</p>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {strategy.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {selectedStrategy === strategy.id && (
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-neon-green text-sm">
                      <Target className="w-4 h-4" />
                      <span>Selected Strategy</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More Button (only visible when showing recommended strategies) */}
        {!showAllStrategies && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleShowMoreStrategies}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 border border-gray-700"
            >
              <Plus className="w-4 h-4" />
              Show More Strategies
            </Button>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleContinue}
            disabled={!selectedStrategy}
            className="bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold px-8 py-3 text-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Test Strategy Now
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <span className="text-gray-400 text-sm">
            {selectedStrategy 
              ? "Click the button above to simulate trading with this strategy" 
              : "Select a strategy above to continue"}
          </span>
        </div>
        {/* For debugging - show if a strategy is selected */}
        {selectedStrategy && (
          <div className="text-center mt-2 text-gray-500 text-xs">
            Strategy {selectedStrategy} selected
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
