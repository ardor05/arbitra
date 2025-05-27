import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Bot, TrendingUp, Target, Zap } from 'lucide-react';

interface TradingPreferencesProps {
  onRecommend: (preferences: TradingPreferenceValues) => void;
}

export interface TradingPreferenceValues {
  riskTolerance: string;
  tradingTimeframe: string;
  expectedReturn: number;
  winRate: number;
  cryptoPreference: string;
}

const TradingPreferences = ({ onRecommend }: TradingPreferencesProps) => {
  const [preferences, setPreferences] = useState<TradingPreferenceValues>({
    riskTolerance: 'moderate',
    tradingTimeframe: 'day',
    expectedReturn: 15,
    winRate: 70,
    cryptoPreference: 'bitcoin'
  });

  const handleChange = (field: keyof TradingPreferenceValues, value: string | number) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecommend = () => {
    onRecommend(preferences);
  };

  return (
    <Card className="glass-morphism border-gray-800">
      <CardHeader>
        <CardTitle className="text-neon-cyan flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Trading Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Risk Tolerance */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center gap-1">
              <Target className="w-4 h-4 text-neon-green" />
              Risk Tolerance
            </Label>
            <Select 
              value={preferences.riskTolerance} 
              onValueChange={(value) => handleChange('riskTolerance', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select risk tolerance" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trading Timeframe */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-neon-cyan" />
              Trading Timeframe
            </Label>
            <Select 
              value={preferences.tradingTimeframe} 
              onValueChange={(value) => handleChange('tradingTimeframe', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select trading timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="scalping">Scalping</SelectItem>
                <SelectItem value="day">Day Trading</SelectItem>
                <SelectItem value="swing">Swing Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expected Return */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-gray-300 flex items-center gap-1">
                <Zap className="w-4 h-4 text-neon-purple" />
                Expected Monthly Return
              </Label>
              <span className="text-neon-cyan font-medium">{preferences.expectedReturn}%</span>
            </div>
            <Slider 
              value={[preferences.expectedReturn]} 
              min={5} 
              max={40} 
              step={1}
              onValueChange={(value) => handleChange('expectedReturn', value[0])}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5%</span>
              <span>20%</span>
              <span>40%</span>
            </div>
          </div>

          {/* Win Rate */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-gray-300 flex items-center gap-1">
                <Target className="w-4 h-4 text-neon-green" />
                Target Win Rate
              </Label>
              <span className="text-neon-cyan font-medium">{preferences.winRate}%</span>
            </div>
            <Slider 
              value={[preferences.winRate]} 
              min={50} 
              max={90} 
              step={1}
              onValueChange={(value) => handleChange('winRate', value[0])}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50%</span>
              <span>70%</span>
              <span>90%</span>
            </div>
          </div>

          {/* Crypto Preference */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center gap-1">
              <Zap className="w-4 h-4 text-neon-purple" />
              Cryptocurrency Preference
            </Label>
            <Select 
              value={preferences.cryptoPreference} 
              onValueChange={(value) => handleChange('cryptoPreference', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="okx">OKX Token</SelectItem>
                <SelectItem value="binance">Binance Coin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recommend Button */}
        <Button 
          onClick={handleRecommend}
          className="w-full bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold py-3 hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300"
        >
          Recommend Strategies
          <TrendingUp className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default TradingPreferences;
