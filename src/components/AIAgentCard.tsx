
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, CircleCheck, Circle } from 'lucide-react';

interface AIAgent {
  id: number;
  name: string;
  description: string;
  type: string;
  winRate: number;
  profit: string;
  status: 'active' | 'inactive' | 'learning';
  color: string;
}

interface AIAgentCardProps {
  agent: AIAgent;
  onSelect: () => void;
}

const AIAgentCard = ({ agent, onSelect }: AIAgentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-neon-green border-neon-green';
      case 'inactive': return 'text-gray-500 border-gray-500';
      case 'learning': return 'text-neon-purple border-neon-purple';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CircleCheck className="w-4 h-4" />;
      case 'learning': return <Circle className="w-4 h-4 animate-pulse" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="glass-morphism border-gray-800 hover:border-gray-600 transition-all duration-300 group cursor-pointer" onClick={onSelect}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Bot className={`w-8 h-8 text-${agent.color} group-hover:animate-float`} />
          <Badge variant="outline" className={getStatusColor(agent.status)}>
            {getStatusIcon(agent.status)}
            <span className="ml-1 capitalize">{agent.status}</span>
          </Badge>
        </div>
        <CardTitle className="text-lg text-white group-hover:text-neon-cyan transition-colors">
          {agent.name}
        </CardTitle>
        <p className="text-sm text-gray-400 line-clamp-2">
          {agent.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Type</span>
          <Badge variant="secondary" className="bg-gray-800 text-gray-300">
            {agent.type}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Win Rate</span>
            <span className={`font-bold text-${agent.color}`}>{agent.winRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Profit</span>
            <span className="font-bold text-neon-green">{agent.profit}</span>
          </div>
        </div>

        <Button 
          className={`w-full bg-${agent.color}/20 border border-${agent.color} text-${agent.color} hover:bg-${agent.color}/30 transition-all duration-300`}
          variant="outline"
        >
          Configure
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIAgentCard;
