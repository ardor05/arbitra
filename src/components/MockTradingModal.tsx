import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, ArrowDown, BarChart3, Play, Pause, RotateCcw, DollarSign, ArrowRight, Share2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCandleData, getOkxTimeframe } from '@/api/okxCandleData';
import DeploymentModal from '@/components/DeploymentModal';

interface MockTradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: any;
}

const MockTradingModal: React.FC<MockTradingModalProps> = ({ isOpen, onClose, strategy }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [budget, setBudget] = useState('10000');
  const [leverage, setLeverage] = useState('1');
  const [positionSize, setPositionSize] = useState('25');
  const [stopLoss, setStopLoss] = useState('2');
  const [takeProfit, setTakeProfit] = useState('5');
  
  const [currentPnL, setCurrentPnL] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [estimatedReturn, setEstimatedReturn] = useState(0);
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [tradeHistory, setTradeHistory] = useState<Array<{timestamp: number, pnl: number, type: string}>>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  
  // State for deployment modal
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Candle data for TradingView style chart
  const [candles, setCandles] = useState<Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>>([]);
  
  // Selected token/timeframe for chart
  const [selectedToken, setSelectedToken] = useState('BTC');
  const [timeframe, setTimeframe] = useState('15m');
  
  // Determine selected token based on strategy
  useEffect(() => {
    if (strategy) {
      // Extract token from strategy.bestFor or use default
      const tokenFromStrategy = strategy.bestFor?.find((item: string) => 
        ['BTC', 'ETH', 'SOL', 'OKB', 'BNB'].includes(item));
      if (tokenFromStrategy) {
        setSelectedToken(tokenFromStrategy);  
      } else {
        // Default to BTC if no match
        setSelectedToken('BTC');
      }
    }
  }, [strategy]);
  
  // Reset values when modal opens or strategy changes
  useEffect(() => {
    if (isOpen && strategy) {
      setIsRunning(false);
      setCurrentPnL(0);
      setTotalTrades(0);
      setWinRate(0);
      setEstimatedReturn(0);
      setMaxDrawdown(0);
      setTradeHistory([]);
      setPriceChange(0);
      
      // Fetch real candle data from OKX
      fetchOkxCandleData();
    }
  }, [isOpen, strategy, selectedToken, timeframe]);
  
  // Fetch real candle data from OKX API
  const fetchOkxCandleData = async () => {
    try {
      const okxTimeframe = getOkxTimeframe(timeframe);
      const candleData = await fetchCandleData(selectedToken, okxTimeframe, 100);
      
      if (candleData && candleData.length > 0) {
        setCandles(candleData);
        // Set current price from latest candle
        const latestCandle = candleData[candleData.length - 1];
        setCurrentPrice(latestCandle.close);
      } else {
        // Fallback to mock data if API fails
        generateMockCandleData();
      }
    } catch (error) {
      console.error('Failed to fetch OKX candle data:', error);
      // Fallback to mock data if API fails
      generateMockCandleData();
    }
  };
  
  // Generate mock candle data as fallback
  const generateMockCandleData = () => {
    const basePrice = 29000 + Math.random() * 1000;
    setCurrentPrice(basePrice);
    
    const initialCandles = [];
    const now = Date.now();
    let price = basePrice;
    
    // Generate 24 candles (hourly)
    for (let i = 24; i >= 0; i--) {
      const volatility = Math.random() * 2 - 1; // -1 to 1
      const change = price * (volatility * 0.01); // 0-1% change
      
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + (Math.random() * Math.abs(change) * 0.5);
      const low = Math.min(open, close) - (Math.random() * Math.abs(change) * 0.5);
      const volume = Math.random() * 100 + 50;
      
      initialCandles.push({
        time: now - (i * 3600 * 1000), // hourly candles
        open,
        high,
        low,
        close,
        volume
      });
      
      price = close; // Next candle starts at the previous close
    }
    
    setCandles(initialCandles);
  };
  
  // Simulate trading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && strategy) {
      interval = setInterval(() => {
        // Base trade success probability on strategy win rate
        const baseWinRate = strategy.winRate / 100;
        const leverageMultiplier = parseFloat(leverage) || 1;
        const positionSizePercent = parseFloat(positionSize) / 100 || 0.25;
        const budgetValue = parseFloat(budget) || 10000;
        
        // Update price with more realistic movement
        const volatility = Math.random() * 2 - 1;
        const priceChange = currentPrice * (volatility * 0.001);
        const newPrice = currentPrice + priceChange;
        setCurrentPrice(newPrice);
        setPriceChange((newPrice - currentPrice) / currentPrice * 100);
        
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
        
        // Update candles for TradingView style chart
        setCandles(prev => {
          const now = Date.now();
          const lastCandle = prev[prev.length - 1];
          const timeDiff = now - lastCandle.time;
          
          // Create a new candle every 5 seconds (simulating hourly candles)
          if (timeDiff >= 5000) {
            const newCandle = {
              time: now,
              open: lastCandle.close,
              close: newPrice,
              high: Math.max(lastCandle.close, newPrice),
              low: Math.min(lastCandle.close, newPrice),
              volume: Math.random() * 100 + 50
            };
            return [...prev.slice(-23), newCandle]; // Keep last 24 candles
          } else {
            // Update the current candle
            const updatedCandles = [...prev];
            const currentCandle = updatedCandles[updatedCandles.length - 1];
            
            currentCandle.close = newPrice;
            currentCandle.high = Math.max(currentCandle.high, newPrice);
            currentCandle.low = Math.min(currentCandle.low, newPrice);
            currentCandle.volume += Math.random() * 5;
            
            return updatedCandles;
          }
        });
        
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, strategy, budget, leverage, positionSize, stopLoss, takeProfit, totalTrades, winRate, currentPnL, maxDrawdown, currentPrice]);
  
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
    setMaxDrawdown(0);
    setTradeHistory([]);
    setCurrentPrice(29000 + Math.random() * 1000);
    setPriceChange(0);
  };
  
  const drawChart = () => {
    if (!canvasRef.current || candles.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 20, right: 40, bottom: 30, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find min/max for scaling
    const prices = candles.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices) * 0.999;
    const maxPrice = Math.max(...prices) * 1.001;
    const priceRange = maxPrice - minPrice;
    
    // Helper functions
    const timeToX = (time: number) => {
      const minTime = candles[0].time;
      const maxTime = candles[candles.length - 1].time;
      const timeRange = maxTime - minTime;
      return padding.left + ((time - minTime) / timeRange) * chartWidth;
    };
    
    const priceToY = (price: number) => {
      return padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    };
    
    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    
    // Price grid lines
    const priceStep = priceRange / 5;
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (i * priceStep);
      const y = priceToY(price);
      
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Price labels
      ctx.fillStyle = '#888';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(1), padding.left - 5, y + 4);
    }
    
    // Time grid lines
    const timeStep = candles.length / 4;
    for (let i = 0; i <= 4; i++) {
      const index = Math.min(Math.floor(i * timeStep), candles.length - 1);
      if (index < 0) continue;
      
      const time = candles[index].time;
      const x = timeToX(time);
      
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      
      // Time labels
      const date = new Date(time);
      const label = date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0');
      ctx.fillStyle = '#888';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, height - padding.bottom + 15);
    }
    
    // Draw candles
    const candleWidth = Math.min(8, chartWidth / candles.length * 0.8);
    
    candles.forEach((d, i) => {
      const x = timeToX(d.time);
      const openY = priceToY(d.open);
      const closeY = priceToY(d.close);
      const highY = priceToY(d.high);
      const lowY = priceToY(d.low);
      
      // Candle body
      ctx.fillStyle = d.close > d.open ? '#26a69a' : '#ef5350';
      ctx.strokeStyle = d.close > d.open ? '#26a69a' : '#ef5350';
      
      const candleHeight = Math.abs(closeY - openY);
      const y = d.close > d.open ? openY : closeY;
      
      ctx.fillRect(x - candleWidth / 2, y, candleWidth, candleHeight || 1); // Min height of 1px
      
      // Candle wicks
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // Add dots for trade signals (if this is a simulated trade)
      if (i > 0 && i < candles.length - 1 && tradeHistory.length > 0 && Math.random() < 0.15) {
        const prevClose = candles[i-1].close;
        const signal = d.open > prevClose * 1.001 ? 'buy' : d.open < prevClose * 0.999 ? 'sell' : null;
        
        if (signal) {
          ctx.beginPath();
          ctx.arc(x, signal === 'buy' ? highY - 10 : lowY + 10, 4, 0, Math.PI * 2);
          ctx.fillStyle = signal === 'buy' ? '#26a69a' : '#ef5350';
          ctx.fill();
        }
      }
    });
    
    // Draw current price line
    if (currentPrice > 0) {
      const y = priceToY(currentPrice);
      
      ctx.beginPath();
      ctx.strokeStyle = '#2962ff';
      ctx.setLineDash([5, 3]);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Current price label
      ctx.fillStyle = '#2962ff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(currentPrice.toFixed(2), width - padding.right + 5, y + 4);
    }
    
    // Draw PnL indicator
    if (currentPnL !== 0) {
      ctx.fillStyle = currentPnL > 0 ? '#26a69a' : '#ef5350';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`PnL: ${currentPnL > 0 ? '+' : ''}$${currentPnL.toFixed(2)}`, width - padding.right, padding.top - 5);
    }
  };
  
  // Animation loop for smooth chart updates
  useEffect(() => {
    const animate = () => {
      drawChart();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (isRunning && candles.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      drawChart(); // Draw at least once even when not running
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, candles, currentPnL]);
  
  useEffect(() => {
    drawChart();
  }, [canvasRef.current, tradeHistory]);
  
  if (!strategy) return null;
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 text-white p-0 max-w-[95%] md:max-w-[90%] lg:max-w-[1000px]">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-green">
            Mock Trading: {strategy ? strategy.name : 'Strategy'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Test this strategy with simulated funds & live market data
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Trading Parameters */}
          <div className="space-y-4">
            <h3 className="font-bold text-neon-cyan">Trading Parameters</h3>
            
            {/* Strategy description - Moved here */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-md p-3 mb-4">
              <div className="text-sm font-bold text-neon-cyan mb-1">Strategy Description</div>
              <p className="text-gray-400 text-xs">{strategy.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {strategy.tags && strategy.tags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="budget" className="text-gray-400">Trading Budget ($)</Label>
              <Input
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                disabled={isRunning}
              />
            </div>
            
            <div>
              <Label htmlFor="leverage" className="text-gray-400">Leverage (x)</Label>
              <Input
                id="leverage"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                disabled={isRunning}
              />
            </div>
            
            <div>
              <Label htmlFor="positionSize" className="text-gray-400">Position Size (%)</Label>
              <Input
                id="positionSize"
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                disabled={isRunning}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="stopLoss" className="text-gray-400">Stop Loss (%)</Label>
                <Input
                  id="stopLoss"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  disabled={isRunning}
                />
              </div>
              <div>
                <Label htmlFor="takeProfit" className="text-gray-400">Take Profit (%)</Label>
                <Input
                  id="takeProfit"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  disabled={isRunning}
                />
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-2">
              {!isRunning ? (
                <Button 
                  onClick={handleStart}
                  className="bg-gradient-to-r from-neon-green to-neon-cyan text-black flex-1"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              ) : (
                <Button 
                  onClick={handlePause}
                  className="bg-gradient-to-r from-neon-purple to-neon-pink text-white flex-1"
                  size="sm"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </Button>
              )}
              
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-gray-600 text-gray-300"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
            
            {/* Decision buttons moved here */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
              <Button 
                variant="outline"
                className="border-gray-700 text-gray-300 flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button 
                className="bg-gradient-to-r from-neon-cyan to-neon-green text-black flex-1"
                onClick={() => {
                  // Save strategy to localStorage as fallback
                  try {
                    localStorage.setItem('selectedStrategy', JSON.stringify(strategy));
                  } catch (error) {
                    console.error('Error saving to localStorage:', error);
                  }
                  
                  // Open the deployment modal instead of navigating
                  setShowDeploymentModal(true);
                }}
                disabled={totalTrades < 5}
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Deploy Strategy
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          
          {/* Middle column - Chart */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {/* Trading chart */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-neon-cyan" />
                      <span className="text-sm font-bold text-neon-cyan">OKX Price Chart</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-mono">
                        <span className="text-gray-400 text-xs">Price:</span> 
                        <span className="text-white ml-1">${currentPrice.toFixed(2)} {selectedToken}/USDT</span>
                      </div>
                      <Badge variant="outline" className={priceChange >= 0 ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}>
                        {priceChange >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                        {Math.abs(priceChange).toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Chart controls */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedToken}
                        onValueChange={(value) => setSelectedToken(value)}
                      >
                        <SelectTrigger className="w-[120px] bg-gray-900 border-gray-700 text-white">
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="BTC">Bitcoin</SelectItem>
                          <SelectItem value="ETH">Ethereum</SelectItem>
                          <SelectItem value="SOL">Solana</SelectItem>
                          <SelectItem value="OKB">OKX Token</SelectItem>
                          <SelectItem value="BNB">Binance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={timeframe}
                        onValueChange={(value) => setTimeframe(value)}
                      >
                        <SelectTrigger className="w-[100px] bg-gray-900 border-gray-700 text-white">
                          <SelectValue placeholder="Timeframe" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="1m">1m</SelectItem>
                          <SelectItem value="5m">5m</SelectItem>
                          <SelectItem value="15m">15m</SelectItem>
                          <SelectItem value="1h">1h</SelectItem>
                          <SelectItem value="4h">4h</SelectItem>
                          <SelectItem value="1d">1d</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <canvas 
                    ref={canvasRef} 
                    width={700}
                    height={300}
                    className="w-full h-[300px]"
                  />
                </CardContent>
              </Card>
              
              {/* Trading metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800 border border-gray-700 rounded-md p-3">
                  <div className="text-gray-400 text-xs mb-1">P&L</div>
                  <div className={`font-bold ${currentPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {currentPnL >= 0 ? '+' : ''}${currentPnL.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-md p-3">
                  <div className="text-gray-400 text-xs mb-1">ROI</div>
                  <div className={`font-bold ${estimatedReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {estimatedReturn >= 0 ? '+' : ''}{estimatedReturn.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-md p-3">
                  <div className="text-gray-400 text-xs mb-1">Trades</div>
                  <div className="font-bold text-white">{totalTrades}</div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-md p-3">
                  <div className="text-gray-400 text-xs mb-1">Win Rate</div>
                  <div className="font-bold text-green-500">{winRate.toFixed(1)}%</div>
                </div>
              </div>
              
              {/* Trade history */}
              <div className="bg-gray-800 border border-gray-700 rounded-md p-3">
                <div className="text-sm font-bold text-neon-cyan mb-2">Recent Trades</div>
                <div className="max-h-[100px] overflow-y-auto pr-2">
                  {tradeHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-2 text-xs">
                      No trades executed yet
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {tradeHistory.slice().reverse().slice(0, 3).map((trade, index) => (
                        <div key={index} className="flex justify-between items-center py-1 border-b border-gray-700 text-xs">
                          <div className="flex items-center">
                            <Badge variant="outline" className={`mr-2 text-xs ${trade.type === 'win' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                              {trade.type === 'win' ? 'WIN' : 'LOSS'}
                            </Badge>
                          </div>
                          <span className={`font-mono ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional content could go here */}
        </DialogContent>
      </Dialog>
      
      {/* Deployment Modal */}
      {showDeploymentModal && (
        <DeploymentModal
          isOpen={showDeploymentModal}
          onClose={() => setShowDeploymentModal(false)}
          strategy={strategy}
          mockResults={{
            pnl: currentPnL,
            trades: totalTrades,
            winRate: winRate,
            estimatedReturn: estimatedReturn,
            maxDrawdown: maxDrawdown,
            tradeHistory: tradeHistory
          }}
        />
      )}
    </>
  );
};

export default MockTradingModal;
