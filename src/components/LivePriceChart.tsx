
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PriceData {
  symbol: string;
  price: number;
  change24h: string;
}

interface ChartDataPoint {
  time: string;
  [key: string]: any;
}

const LivePriceChart = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('price-aggregator', {
        body: { assets: ['BTC', 'ETH', 'SOL'] }
      });

      if (error) throw error;

      if (data?.data) {
        // Simplify the data to only essential fields
        const simplifiedData = data.data.slice(0, 3).map((item: any) => ({
          symbol: item.symbol,
          price: item.price,
          change24h: item.change24h
        }));

        setPriceData(simplifiedData);
        
        // Update chart data
        const newDataPoint: ChartDataPoint = {
          time: new Date().toLocaleTimeString(),
        };
        
        simplifiedData.forEach((item: PriceData) => {
          newDataPoint[item.symbol] = item.price;
        });

        setChartData(prev => {
          const updated = [...prev, newDataPoint];
          return updated.slice(-10); // Keep only last 10 data points for cleaner chart
        });
        
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching price data:', err);
      setError('Failed to fetch price data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData();
    const interval = setInterval(fetchPriceData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getColors = () => ['#00d2ff', '#00ff88', '#ff0080'];

  if (isLoading) {
    return (
      <Card className="glass-morphism border-gray-800">
        <CardContent className="flex items-center justify-center h-40">
          <div className="text-center space-y-2">
            <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-sm">Loading prices...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-morphism border-gray-800">
        <CardContent className="flex items-center justify-center h-40">
          <div className="text-center space-y-2">
            <p className="text-red-400 text-sm">{error}</p>
            <button 
              onClick={fetchPriceData}
              className="text-neon-cyan hover:text-neon-green transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-neon-cyan text-lg">Live Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Simple Price Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {priceData.map((asset, index) => (
            <div key={asset.symbol} className="text-center">
              <div className="text-lg font-bold text-white">{asset.symbol}</div>
              <div className="text-xl font-bold text-neon-cyan">
                ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs ${parseFloat(asset.change24h) >= 0 ? 'border-neon-green text-neon-green' : 'border-red-500 text-red-500'}`}
              >
                {parseFloat(asset.change24h) >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {asset.change24h}%
              </Badge>
            </div>
          ))}
        </div>

        {/* Simple Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                fontSize={10}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={10}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
              />
              {priceData.map((asset, index) => (
                <Line
                  key={asset.symbol}
                  type="monotone"
                  dataKey={asset.symbol}
                  stroke={getColors()[index]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, fill: getColors()[index] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePriceChart;
