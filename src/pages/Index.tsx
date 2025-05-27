
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, CircleCheck, CirclePlus, Diamond } from 'lucide-react';
import TradingMetrics from '@/components/TradingMetrics';
import AIAgentCard from '@/components/AIAgentCard';
import BotConfiguration from '@/components/BotConfiguration';

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);

  const aiAgents = [
    {
      id: 1,
      name: "Neural Scalper",
      description: "High-frequency trading with neural network analysis",
      type: "Scalping",
      winRate: 87.2,
      profit: "+$12,450",
      status: "active" as const,
      color: "neon-cyan"
    },
    {
      id: 2,
      name: "Quantum Trend",
      description: "Long-term trend following using quantum algorithms",
      type: "Trend Following",
      winRate: 73.8,
      profit: "+$8,920",
      status: "active" as const,
      color: "neon-green"
    },
    {
      id: 3,
      name: "Alpha Arbitrage",
      description: "Cross-exchange arbitrage opportunities detector",
      type: "Arbitrage",
      winRate: 91.5,
      profit: "+$15,670",
      status: "inactive" as const,
      color: "neon-purple"
    },
    {
      id: 4,
      name: "Sentiment AI",
      description: "Social sentiment analysis for market prediction",
      type: "Sentiment",
      winRate: 69.4,
      profit: "+$6,340",
      status: "learning" as const,
      color: "neon-pink"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-green to-neon-purple animate-glow-pulse">
            Neural Trading Hub
          </h1>
          <p className="text-xl text-gray-400">
            AI-Powered Trading Bots for OKX Exchange
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="border-neon-cyan text-neon-cyan glow-effect">
              <CircleCheck className="w-4 h-4 mr-2" />
              Connected to OKX
            </Badge>
            <Badge variant="outline" className="border-neon-green text-neon-green glow-effect">
              <Bot className="w-4 h-4 mr-2" />
              4 AI Agents Active
            </Badge>
          </div>
        </div>

        {/* Trading Metrics */}
        <TradingMetrics />

        {/* Main Content */}
        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-gray-800">
            <TabsTrigger 
              value="agents" 
              className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
            >
              AI Agents
            </TabsTrigger>
            <TabsTrigger 
              value="configure" 
              className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
            >
              Configure
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-neon-purple"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">AI Trading Agents</h2>
              <Button className="bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300">
                <CirclePlus className="w-5 h-5 mr-2" />
                Create New Agent
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiAgents.map((agent) => (
                <AIAgentCard 
                  key={agent.id} 
                  agent={agent} 
                  onSelect={() => setSelectedAgent(agent)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="configure" className="space-y-6">
            <BotConfiguration selectedAgent={selectedAgent} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-morphism border-gray-800">
              <CardHeader>
                <CardTitle className="text-neon-purple neon-text">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Diamond className="w-16 h-16 mx-auto text-neon-purple mb-4 animate-float" />
                  <p className="text-gray-400">Advanced analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
