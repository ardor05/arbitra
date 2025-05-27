import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';

interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  selectedStrategy: any;
  isRunning: boolean;
  pnl: number;
}

const TradingChart: React.FC<TradingChartProps> = ({ selectedStrategy, isRunning, pnl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [lastTrade, setLastTrade] = useState<{type: string, price: number, time: number} | null>(null);

  // Generate initial chart data
  useEffect(() => {
    if (!chartData.length) {
      const initialData: ChartDataPoint[] = [];
      const now = Date.now();
      let price = 29000 + Math.random() * 1000; // Starting price for BTC
      
      // Generate 24 hours of data (hourly candles)
      for (let i = 24; i >= 0; i--) {
        const volatility = Math.random() * 2 - 1; // -1 to 1
        const change = price * (volatility * 0.01); // 0-1% change
        
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + (Math.random() * Math.abs(change) * 0.5);
        const low = Math.min(open, close) - (Math.random() * Math.abs(change) * 0.5);
        const volume = Math.random() * 100 + 50;
        
        initialData.push({
          time: now - (i * 3600 * 1000), // hourly candles
          open,
          high,
          low,
          close,
          volume
        });
        
        price = close; // Next candle starts at the previous close
      }
      
      setChartData(initialData);
      setCurrentPrice(price);
    }
  }, [chartData.length]);

  // Simulate trading activity when running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && selectedStrategy) {
      interval = setInterval(() => {
        const lastCandle = chartData[chartData.length - 1];
        if (!lastCandle) return;
        
        // Generate a new price movement
        const volatility = (Math.random() * 2 - 1) * (selectedStrategy.risk === 'High' ? 1.5 : selectedStrategy.risk === 'Medium' ? 1 : 0.5);
        const priceChange = lastCandle.close * (volatility * 0.002); // 0-0.2% change
        const newPrice = lastCandle.close + priceChange;
        
        // 10% chance of executing a trade
        if (Math.random() < 0.1) {
          const tradeType = newPrice > lastCandle.close ? 'buy' : 'sell';
          setLastTrade({
            type: tradeType,
            price: newPrice,
            time: Date.now()
          });
        }
        
        // Update the current candle or create a new one based on time
        const now = Date.now();
        const lastCandleTime = lastCandle.time;
        const timeDiff = now - lastCandleTime;
        
        if (timeDiff >= 3600 * 1000) { // Create a new hourly candle
          // New candle
          const newCandle: ChartDataPoint = {
            time: now,
            open: lastCandle.close,
            close: newPrice,
            high: Math.max(lastCandle.close, newPrice),
            low: Math.min(lastCandle.close, newPrice),
            volume: Math.random() * 100 + 50
          };
          
          setChartData(prev => [...prev, newCandle]);
        } else {
          // Update the current candle
          const updatedCandles = [...chartData];
          const currentCandle = updatedCandles[updatedCandles.length - 1];
          
          currentCandle.close = newPrice;
          currentCandle.high = Math.max(currentCandle.high, newPrice);
          currentCandle.low = Math.min(currentCandle.low, newPrice);
          currentCandle.volume += Math.random() * 5;
          
          setChartData(updatedCandles);
        }
        
        setCurrentPrice(newPrice);
        setPriceChange((newPrice - lastCandle.open) / lastCandle.open * 100);
        
      }, 2000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, chartData, selectedStrategy]);

  // Draw the chart
  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return;
    
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
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices) * 0.999;
    const maxPrice = Math.max(...prices) * 1.001;
    const priceRange = maxPrice - minPrice;
    
    // Helper functions
    const timeToX = (time: number) => {
      const minTime = chartData[0].time;
      const maxTime = chartData[chartData.length - 1].time;
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
    const timeStep = chartData.length / 4;
    for (let i = 0; i <= 4; i++) {
      const index = Math.min(Math.floor(i * timeStep), chartData.length - 1);
      if (index < 0) continue;
      
      const time = chartData[index].time;
      const x = timeToX(time);
      
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      
      // Time labels
      const date = new Date(time);
      const label = date.getHours() + ':00';
      ctx.fillStyle = '#888';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, height - padding.bottom + 15);
    }
    
    // Draw candles
    const candleWidth = Math.min(8, chartWidth / chartData.length * 0.8);
    
    chartData.forEach((d, i) => {
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
      
      ctx.fillRect(x - candleWidth / 2, y, candleWidth, candleHeight);
      
      // Candle wicks
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // Add dots for trade signals (hypothetical)
      if (i > 0 && i < chartData.length - 1 && Math.random() < 0.15) {
        const prevClose = chartData[i-1].close;
        const signal = d.open > prevClose * 1.005 ? 'buy' : d.open < prevClose * 0.995 ? 'sell' : null;
        
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
    if (pnl !== 0) {
      ctx.fillStyle = pnl > 0 ? '#26a69a' : '#ef5350';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`PnL: ${pnl > 0 ? '+' : ''}$${pnl.toFixed(2)}`, width - padding.right, padding.top - 5);
    }
    
  }, [chartData, currentPrice, pnl]);

  return (
    <Card className="glass-morphism border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-neon-cyan flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {selectedStrategy ? selectedStrategy.name : 'Trading Chart'}
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-sm font-mono">
              <span className="text-gray-400">Price:</span> 
              <span className="text-white ml-1">${currentPrice.toFixed(2)}</span>
            </div>
            <Badge variant="outline" className={priceChange >= 0 ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}>
              {priceChange >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {Math.abs(priceChange).toFixed(2)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] relative">
          <canvas 
            ref={canvasRef} 
            width={800}
            height={300}
            className="w-full h-full"
          />
          
          {lastTrade && (
            <div className={`absolute top-2 right-2 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
              lastTrade.type === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
            }`}>
              {lastTrade.type === 'buy' ? 'BUY' : 'SELL'} @ ${lastTrade.price.toFixed(2)}
            </div>
          )}
          
          {!isRunning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <p className="text-gray-300 text-xl">Start simulation to view trading activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingChart;
