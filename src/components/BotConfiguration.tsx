
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, CircleCheck } from 'lucide-react';

interface BotConfigurationProps {
  selectedAgent: any;
}

const BotConfiguration = ({ selectedAgent }: BotConfigurationProps) => {
  if (!selectedAgent) {
    return (
      <Card className="glass-morphism border-gray-800">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Bot className="w-16 h-16 mx-auto text-gray-500" />
            <p className="text-gray-400">Select an AI agent to configure</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Bot className={`w-8 h-8 text-${selectedAgent.color}`} />
        <div>
          <h2 className="text-2xl font-bold text-white">{selectedAgent.name}</h2>
          <p className="text-gray-400">{selectedAgent.description}</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-gray-800">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-morphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-neon-cyan">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Trading Pair</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select trading pair" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="btc-usdt">BTC/USDT</SelectItem>
                      <SelectItem value="eth-usdt">ETH/USDT</SelectItem>
                      <SelectItem value="ada-usdt">ADA/USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Position Size</Label>
                  <Input 
                    type="number" 
                    placeholder="1000" 
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-300">Risk Level: Medium</Label>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-trade" />
                  <Label htmlFor="auto-trade" className="text-gray-300">Enable Auto Trading</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card className="glass-morphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-neon-green">Risk Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Stop Loss (%)</Label>
                  <Input 
                    type="number" 
                    placeholder="5" 
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Take Profit (%)</Label>
                  <Input 
                    type="number" 
                    placeholder="15" 
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Max Drawdown (%)</Label>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Daily Loss Limit</Label>
                  <Input 
                    type="number" 
                    placeholder="500" 
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <Card className="glass-morphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-neon-purple">Trading Signals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">RSI Signals</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">MACD Signals</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Volume Analysis</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">News Sentiment</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="glass-morphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-neon-pink">Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">AI Model</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="neural-v1">Neural Network v1</SelectItem>
                      <SelectItem value="transformer">Transformer Model</SelectItem>
                      <SelectItem value="ensemble">Ensemble Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-300">Learning Rate: 0.001</Label>
                  <Slider
                    defaultValue={[1]}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="border-gray-600 text-gray-300">
          Reset to Default
        </Button>
        <Button className="bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold">
          <CircleCheck className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default BotConfiguration;
