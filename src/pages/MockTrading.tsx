
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, Play, Pause, RotateCcw, ArrowRight, ArrowLeft, DollarSign, LineChart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import TradingChart from '@/components/TradingChart';

const MockTrading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  
  // Get the strategy ID from URL query parameters
  useEffect(() => {
    // Get strategy ID from query parameter
    const queryParams = new URLSearchParams(window.location.search);
    const strategyId = queryParams.get('strategy');
    
    if (strategyId) {
      // Find strategy by ID
      const allStrategies = [
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
          tags: ["Technical analysis", "Mean-reversion", "Volatility"],
          bestFor: ["Moderate", "Day Trading", "Ethereum"]
        },
        {
          id: 6,
          name: "Trend Master",
          summary: "Long-term trend following strategy",
          risk: "Medium",
          frequency: "2-5 trades weekly",
          expectedReturn: "15-20% monthly",
          winRate: 68,
          description: "Identifies and follows major market trends using EMA crossovers and ADX indicator. Designed to capture significant price movements over days to weeks.",
          tags: ["Trend-following", "Technical analysis", "Swing trading"],
          bestFor: ["Moderate", "Swing Trading", "Bitcoin"]
        },
        {
          id: 7,
          name: "Wave Rider",
          summary: "Elliott Wave-based trading strategy",
          risk: "Medium",
          frequency: "3-7 trades weekly",
          expectedReturn: "15-22% monthly",
          winRate: 65,
          description: "Uses Elliott Wave Theory to identify market cycles and predict future price movements. Aims to enter at the beginning of impulsive waves and exit before corrective waves.",
          tags: ["Elliott Wave", "Cyclical analysis", "Technical"],
          bestFor: ["Moderate", "Swing Trading", "Ethereum"]
        },
        {
          id: 8,
          name: "Breakout Hunter",
          summary: "Capturing high-momentum breakout moves",
          risk: "High",
          frequency: "10-20 trades weekly",
          expectedReturn: "18-30% monthly",
          winRate: 58,
          description: "Identifies and enters breakouts from consolidation patterns, channels, or key resistance levels. Uses volume confirmation and targets extensions of the breakout move.",
          tags: ["Breakout", "Momentum", "Volume analysis"],
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
          tags: ["DeFi", "Smart contracts", "Arbitrage"],
          bestFor: ["Aggressive", "Scalping", "OKX"]
        }
      ];
      
      const strategy = allStrategies.find(s => s.id === parseInt(strategyId));
      if (strategy) {
        console.log('Found strategy by ID:', strategy);
        setSelectedStrategy(strategy);
      } else {
        console.error('Strategy not found for ID:', strategyId);
      }
    } else {
      // Fallback to localStorage if no query parameter
      const storedStrategy = localStorage.getItem('selectedStrategy');
      if (storedStrategy) {
        try {
          const strategyData = JSON.parse(storedStrategy);
          setSelectedStrategy(strategyData);
          console.log('Loaded strategy from localStorage:', strategyData);
        } catch (error) {
          console.error('Error parsing strategy data:', error);
        }
      } else {
        console.warn('No strategy found in query parameters or localStorage');
      }
    }
  }, []);
  
  const [isRunning, setIsRunning] = useState(false);
  const [budget, setBudget] = useState('10000');
  const [period, setPeriod] = useState('7');
  const [stopCriteria, setStopCriteria] = useState('5');
  const [leverage, setLeverage] = useState('1');
  const [positionSize, setPositionSize] = useState('25');
  const [stopLoss, setStopLoss] = useState('2');
  const [takeProfit, setTakeProfit] = useState('5');
  
  const [currentPnL, setCurrentPnL] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [estimatedReturn, setEstimatedReturn] = useState(0);
  const [averageTradeSize, setAverageTradeSize] = useState(0);
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [tradeHistory, setTradeHistory] = useState<Array<{timestamp: number, pnl: number, type: string}>>([]);
  const [chartData, setChartData] = useState<Array<{time: number, value: number}>>([]);

  // Simulate trading results
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && selectedStrategy) {
      // Initialize chart data if empty
      if (chartData.length === 0) {
        const initialData = [];
        const now = Date.now();
        // Create some historical data points
        for (let i = 20; i >= 0; i--) {
          initialData.push({
            time: now - (i * 3600 * 1000), // hourly data points
            value: 10000 + (Math.random() * 500 - 250)
          });
        }
        setChartData(initialData);
      }
      
      interval = setInterval(() => {
        // Base trade success probability on strategy win rate
        const baseWinRate = selectedStrategy.winRate / 100;
        const leverageMultiplier = parseFloat(leverage) || 1;
        const positionSizePercent = parseFloat(positionSize) / 100 || 0.25;
        const budgetValue = parseFloat(budget) || 10000;
        
        // Calculate trade outcome
        const isWinningTrade = Math.random() < baseWinRate;
        const tradeSize = budgetValue * positionSizePercent * leverageMultiplier;
        const profitLossPercent = isWinningTrade 
          ? (Math.random() * parseFloat(takeProfit)) 
          : -(Math.random() * parseFloat(stopLoss));
        const tradePnL = tradeSize * (profitLossPercent / 100);
        
        // Update metrics
        setCurrentPnL(prev => prev + tradePnL);
        setTotalTrades(prev => prev + 1);
        setAverageTradeSize(prev => (prev * (totalTrades) + tradeSize) / (totalTrades + 1));
        
        // Update win rate based on actual trades
        const newWinCount = (winRate / 100) * totalTrades + (isWinningTrade ? 1 : 0);
        const newWinRate = (newWinCount / (totalTrades + 1)) * 100;
        setWinRate(newWinRate);
        
        // Calculate drawdown
        const newDrawdown = Math.min(maxDrawdown, profitLossPercent);
        if (newDrawdown < maxDrawdown) setMaxDrawdown(newDrawdown);
        
        // Update estimated return
        setEstimatedReturn(prev => {
          const newReturn = (currentPnL + tradePnL) / budgetValue * 100;
          return parseFloat(newReturn.toFixed(2));
        });
        
        // Add to trade history
        setTradeHistory(prev => [
          ...prev, 
          {timestamp: Date.now(), pnl: tradePnL, type: isWinningTrade ? 'win' : 'loss'}
        ]);
        
        // Update chart data
        setChartData(prev => {
          const lastValue = prev[prev.length - 1]?.value || 10000;
          return [...prev, {time: Date.now(), value: lastValue + tradePnL}];
        });
        
      }, 1500); // Slightly slower interval for more realistic trading
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedStrategy, budget, leverage, positionSize, stopLoss, takeProfit, totalTrades, winRate, currentPnL, maxDrawdown]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPnL(0);
    setTotalTrades(0);
    setWinRate(0);
    setEstimatedReturn(0);
  };

  const handleDeploy = () => {
    navigate('/deployment', { 
      state: { 
        selectedStrategy,
        mockResults: {
          pnl: currentPnL,
          trades: totalTrades,
          winRate,
          estimatedReturn
        }
      }
    });
  };

  if (!selectedStrategy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 flex items-center justify-center">
        <Card className="glass-morphism border-gray-800 p-8 text-center">
          <CardContent>
            <p className="text-gray-400 mb-4">No strategy selected</p>
            <Button onClick={() => navigate('/recommendations')} className="bg-gradient-to-r from-neon-cyan to-neon-green text-black">
              Go Back to Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button 
          onClick={() => navigate('/recommendations')}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recommendations
        </Button>
      </div>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-neon-cyan to-neon-green rounded-2xl flex items-center justify-center glass-morphism">
              <Bot className="w-10 h-10 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-green to-neon-purple">
            Mock Trading
          </h1>
          <p className="text-lg text-gray-400">
            Test your strategy with simulated funds & live market data
          </p>
          <Badge variant="outline" className={`border-${selectedStrategy.color} text-${selectedStrategy.color} bg-${selectedStrategy.color}/10`}>
            {selectedStrategy.name}
          </Badge>
        </div>

        {/* Trading Chart */}
        <TradingChart 
          selectedStrategy={selectedStrategy} 
          isRunning={isRunning} 
          pnl={currentPnL} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customization Panel */}
          <div className="space-y-6">
            <Card className="glass-morphism border-gray-800">
              <CardHeader>
                <CardTitle className="text-neon-green">Strategy Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="budget" className="text-gray-400">Trading Budget ($)</Label>
                  <Input
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="glass-input"
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <Label htmlFor="period" className="text-gray-400">Test Period (days)</Label>
                  <Input
                    id="period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="glass-input"
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <Label htmlFor="leverage" className="text-gray-400">Leverage (x)</Label>
                  <Input
                    id="leverage"
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    className="glass-input"
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <Label htmlFor="positionSize" className="text-gray-400">Position Size (% of capital)</Label>
                  <Input
                    id="positionSize"
                    value={positionSize}
                    onChange={(e) => setPositionSize(e.target.value)}
                    className="glass-input"
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <Label htmlFor="stopLoss" className="text-gray-400">Stop Loss (%)</Label>
                  <Input
                    id="stopLoss"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="glass-input"
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <Label htmlFor="takeProfit" className="text-gray-400">Take Profit (%)</Label>
                  <Input
                    id="takeProfit"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="glass-input"
                    disabled={isRunning}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-gray-800">
              <CardHeader>
                <CardTitle className="text-neon-purple">Result Panel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">P&L Estimation</span>
                    <span className={`font-bold ${currentPnL >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                      {currentPnL >= 0 ? '+' : ''}${currentPnL.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Trades</span>
                    <span className="text-white">{totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-neon-green">{winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Trade Size</span>
                    <span className="text-white">${averageTradeSize.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ROI</span>
                    <span className={`${estimatedReturn >= 0 ? 'text-neon-cyan' : 'text-red-500'}`}>
                      {estimatedReturn >= 0 ? '+' : ''}{estimatedReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Drawdown</span>
                    <span className="text-red-500">{maxDrawdown.toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategy Performance */}
          <div className="lg:col-span-2">
            <Card className="glass-morphism border-gray-800">
              <CardHeader>
                <CardTitle className="text-neon-cyan">Strategy Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {/* Left column metrics */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-neon-green font-bold mb-2">Profitability</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">Total P&L</div>
                          <div className={`font-bold ${currentPnL >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                            {currentPnL >= 0 ? '+' : ''}${currentPnL.toFixed(2)}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">ROI</div>
                          <div className={`font-bold ${estimatedReturn >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                            {estimatedReturn >= 0 ? '+' : ''}{estimatedReturn.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-neon-cyan font-bold mb-2">Performance</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">Win Rate</div>
                          <div className="font-bold text-neon-green">{winRate.toFixed(1)}%</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">Max Drawdown</div>
                          <div className="font-bold text-red-500">{maxDrawdown.toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column metrics */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-neon-purple font-bold mb-2">Trade Statistics</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">Total Trades</div>
                          <div className="font-bold text-white">{totalTrades}</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">Avg Trade Size</div>
                          <div className="font-bold text-white">${averageTradeSize.toFixed(0)}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-neon-cyan font-bold mb-2">Comparison</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">Strategy ROI</div>
                          <div className="font-bold text-neon-green">{estimatedReturn.toFixed(2)}%</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-gray-400 text-xs mb-1">Market Avg</div>
                          <div className="font-bold text-gray-400">+2.5%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trade History */}
        <Card className="glass-morphism border-gray-800">
          <CardHeader>
            <CardTitle className="text-neon-cyan flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Trade History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-40 overflow-y-auto pr-2">
              {tradeHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No trades executed yet. Start the simulation to see trade history.
                </div>
              ) : (
                <div className="space-y-2">
                  {tradeHistory.slice().reverse().map((trade, index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b border-gray-800">
                      <div className="flex items-center">
                        <Badge variant="outline" className={`mr-2 ${trade.type === 'win' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                          {trade.type === 'win' ? 'WIN' : 'LOSS'}
                        </Badge>
                        <span className="text-gray-400 text-xs">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <span className={`font-mono ${trade.pnl >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                        {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <Button 
              onClick={handleStart}
              className="bg-gradient-to-r from-neon-green to-neon-cyan text-black font-bold px-6 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Simulation
            </Button>
          ) : (
            <Button 
              onClick={handlePause}
              className="bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold px-6 py-3"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          
          <Button 
            onClick={handleReset}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>

          <Button 
            onClick={handleDeploy}
            disabled={totalTrades === 0}
            className="bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold px-6 py-3 disabled:opacity-50"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Deploy Strategy
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MockTrading;
