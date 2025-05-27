
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const TradingMetrics = () => {
  const metrics = [
    {
      title: "Total Portfolio",
      value: "$127,450.00",
      change: "+12.45%",
      color: "neon-cyan",
      trend: "up"
    },
    {
      title: "Active Trades",
      value: "24",
      change: "+3",
      color: "neon-green",
      trend: "up"
    },
    {
      title: "Win Rate",
      value: "87.2%",
      change: "+2.1%",
      color: "neon-purple",
      trend: "up"
    },
    {
      title: "Daily P&L",
      value: "+$2,340",
      change: "+18.7%",
      color: "neon-pink",
      trend: "up"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="glass-morphism border-gray-800 hover:border-gray-700 transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold text-${metric.color} neon-text group-hover:animate-glow-pulse`}>
                {metric.value}
              </div>
              <Badge 
                variant="outline" 
                className={`border-${metric.color} text-${metric.color} bg-${metric.color}/10`}
              >
                {metric.change}
              </Badge>
              <Progress 
                value={75} 
                className="h-2 bg-gray-800"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TradingMetrics;
