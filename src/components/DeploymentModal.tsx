import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Bot, 
  Activity, 
  Share2, 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  CreditCard,
  RefreshCw,
  ArrowRight,
  Copy,
  MessageSquare,
  Settings,
  BellRing
} from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: any;
  mockResults: any;
}

const DeploymentModal: React.FC<DeploymentModalProps> = ({ 
  isOpen, 
  onClose, 
  strategy,
  mockResults
}) => {
  const [isDeployed, setIsDeployed] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [okxConnected, setOkxConnected] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [executionLogs, setExecutionLogs] = useState<Array<{time: string, message: string, type: string}>>([]);
  
  // Notification settings
  const [telegramHandle, setTelegramHandle] = useState('@your_telegram');
  const [notificationFrequency, setNotificationFrequency] = useState('hourly');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  
  // Metrics for the deployed bot
  const [liveMetrics, setLiveMetrics] = useState({
    activeTrades: 0,
    dailyPnL: 0,
    uptime: '0h 0m',
    totalTrades: mockResults?.trades || 0,
    balance: 10000,
    equity: 10000
  });

  // Start deployment automatically when modal opens
  useEffect(() => {
    if (isOpen && !isDeployed && deploymentProgress === 0) {
      handleDeploy();
    }
  }, [isOpen]);

  // Simulate deployment progress
  useEffect(() => {
    if (!isDeployed && deploymentProgress < 100) {
      const timer = setTimeout(() => {
        setDeploymentProgress(prev => Math.min(100, prev + 5));
      }, 300);
      return () => clearTimeout(timer);
    } else if (deploymentProgress === 100 && !isDeployed) {
      setIsDeployed(true);
      setOkxConnected(true);
    }
  }, [deploymentProgress, isDeployed]);

  // Simulate live metrics updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDeployed) {
      interval = setInterval(() => {
        setLiveMetrics(prev => {
          const pnlChange = (Math.random() - 0.4) * 20;
          const newActiveTrades = Math.max(0, prev.activeTrades + Math.floor(Math.random() * 3 - 1));
          const newTotalTrades = prev.totalTrades + (Math.random() > 0.7 ? 1 : 0);
          const newBalance = prev.balance + pnlChange;
          
          return {
            activeTrades: newActiveTrades,
            dailyPnL: prev.dailyPnL + pnlChange,
            uptime: `${Math.floor(prev.uptime.split('h')[0] as unknown as number) + Math.floor(Date.now() / 3600000)}h ${Math.floor((Date.now() % 3600000) / 60000)}m`,
            totalTrades: newTotalTrades,
            balance: newBalance,
            equity: newBalance * (1 + Math.random() * 0.05)
          };
        });
      }, 2000);
      
      // Add new logs periodically
      const logInterval = setInterval(() => {
        setExecutionLogs(prevLogs => [
          ...prevLogs,
          generateExecutionLog()
        ].slice(-50)); // Keep last 50 logs
      }, 3000);
      
      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
    return () => {};
  }, [isDeployed]);

  const handleDeploy = () => {
    setDeploymentProgress(1);
    
    // Generate initial deployment logs
    setExecutionLogs([
      { time: getCurrentTime(), message: 'Initializing deployment process', type: 'info' },
      { time: getCurrentTime(), message: 'Connecting to OKX trading platform', type: 'info' },
      { time: getCurrentTime(), message: 'Validating API credentials', type: 'info' }
    ]);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/bot/${strategy?.name.toLowerCase().replace(/\s+/g, '-')}`;
    await navigator.clipboard.writeText(shareUrl);
    alert('Bot link copied to clipboard!');
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  };

  // Generate execution logs with timestamps
  const generateExecutionLog = () => {
    const types = ['info', 'success', 'warning', 'error'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const infoMessages = [
      `Analyzing market conditions for ${strategy?.name}`,
      'Fetching order book data from OKX API',
      'Calculating optimal entry points',
      'Monitoring price action',
      'Scanning for arbitrage opportunities',
      'Checking for trend reversals',
      'Analyzing market sentiment',
      'Calculating risk parameters',
      'Fetching wallet balances',
      'Checking API rate limits'
    ];
    
    const successMessages = [
      `Opened ${Math.random() > 0.5 ? 'LONG' : 'SHORT'} position at $${(Math.random() * 1000 + 28000).toFixed(2)}`,
      `Closed position with ${Math.random() > 0.6 ? '+' : '-'}${(Math.random() * 100).toFixed(2)} profit`,
      'Successfully updated stop loss',
      'Take profit order executed',
      'Strategy parameters optimized',
      'OKX connection refreshed',
      'Wallet synchronization complete'
    ];
    
    const warningMessages = [
      'High volatility detected, adjusting parameters',
      'Approaching daily trade limit',
      'Unusual market conditions detected',
      'Network latency detected',
      'API rate limit at 80%',
      'Slippage detected on order execution'
    ];
    
    const errorMessages = [
      'Failed to execute order, retrying',
      'Temporary API timeout, reconnecting',
      'Order partially filled',
      'Price slippage exceeded limits',
      'Network connection interrupted'
    ];
    
    let message = '';
    switch(type) {
      case 'info':
        message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
        break;
      case 'success':
        message = successMessages[Math.floor(Math.random() * successMessages.length)];
        break;
      case 'warning':
        message = warningMessages[Math.floor(Math.random() * warningMessages.length)];
        break;
      case 'error':
        message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        break;
    }
    
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    return { time, message, type };
  };

  if (!strategy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 text-white p-0 max-w-[95%] md:max-w-[90%] lg:max-w-[1000px]">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-green">
            OKX Deployment: {strategy.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Deploy your trading bot to the OKX cryptocurrency exchange
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {/* Strategy Info Badge */}
          <div className="flex justify-center mb-6">
            <Badge 
              variant="outline" 
              className={`border-${strategy.color} text-${strategy.color} bg-${strategy.color}/10 px-4 py-2 text-sm`}
            >
              {strategy.name}
            </Badge>
          </div>
          
          {deploymentProgress < 100 ? (
            <div className="text-center py-10">
              <div className="text-neon-cyan mb-4 text-xl font-bold">
                Connecting to OKX... {deploymentProgress}%
              </div>
              <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-3 mb-6">
                <div 
                  className="bg-gradient-to-r from-neon-cyan to-neon-green h-3 rounded-full transition-all duration-300"
                  style={{ width: `${deploymentProgress}%` }}
                />
              </div>
              <div className="bg-gray-900 p-4 rounded-md max-w-lg mx-auto mt-8 text-left">
                <div className="font-mono text-xs space-y-1 max-h-[150px] overflow-y-auto">
                  {executionLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`${log.type === 'success' ? 'text-neon-green' : 
                                log.type === 'warning' ? 'text-amber-500' : 
                                log.type === 'error' ? 'text-red-500' : 
                                'text-neon-cyan'}`}
                    >
                      [{log.time}] {log.message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="logs" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="logs">Execution Logs</TabsTrigger>
                <TabsTrigger value="results">Trading Results</TabsTrigger>
                <TabsTrigger value="settings">Bot Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="logs" className="space-y-4">
                <Card className="glass-morphism border-gray-800">
                  <CardHeader className="flex flex-row justify-between items-center pb-2">
                    <CardTitle className="text-neon-cyan flex items-center gap-2 text-lg">
                      <Bot className="w-5 h-5" />
                      OKX Trading Execution Logs
                    </CardTitle>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh Logs
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 p-4 rounded-md h-[350px] overflow-y-auto font-mono text-xs text-gray-300">
                      {executionLogs.map((log, index) => (
                        <div 
                          key={index} 
                          className={`${log.type === 'success' ? 'text-neon-green' : 
                                    log.type === 'warning' ? 'text-amber-500' : 
                                    log.type === 'error' ? 'text-red-500' : 
                                    'text-neon-cyan'}`}
                        >
                          [{log.time}] {log.message}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="border-neon-green text-neon-green"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected to OKX
                    </Badge>
                    <div className="text-xs text-gray-400">
                      Uptime: {liveMetrics.uptime}
                    </div>
                  </div>
                  <Button 
                    className="bg-neon-cyan hover:bg-neon-cyan/90 text-black"
                    size="sm"
                    onClick={() => window.open('https://web3.okx.com/portfolio', '_blank')}
                  >
                    Go to OKX Dashboard
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="results">
                <Card className="glass-morphism border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-neon-green flex items-center gap-2 text-lg">
                      <Activity className="w-5 h-5" />
                      Trading Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neon-green">${mockResults.pnl.toFixed(2)}</div>
                        <div className="text-gray-400 text-sm">Total P&L</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neon-cyan">{liveMetrics.totalTrades}</div>
                        <div className="text-gray-400 text-sm">Total Trades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neon-purple">{mockResults.winRate.toFixed(1)}%</div>
                        <div className="text-gray-400 text-sm">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neon-pink">{mockResults.estimatedReturn.toFixed(2)}%</div>
                        <div className="text-gray-400 text-sm">ROI</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-300">Live Trading Metrics</h3>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Active Trades</div>
                        <div className="text-neon-green">{liveMetrics.activeTrades}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Account Balance</div>
                        <div className="text-white">${liveMetrics.balance.toFixed(2)}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Account Equity</div>
                        <div className="text-white">${liveMetrics.equity.toFixed(2)}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Daily P&L</div>
                        <div className={liveMetrics.dailyPnL >= 0 ? "text-neon-green" : "text-red-500"}>
                          {liveMetrics.dailyPnL >= 0 ? '+' : ''}{liveMetrics.dailyPnL.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="glass-morphism border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-neon-cyan flex items-center gap-2 text-lg">
                      <CreditCard className="w-5 h-5" />
                      Bot Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Strategy Name</div>
                        <div className="text-white">{strategy.name}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Trading Pair</div>
                        <div className="text-white">BTC/USDT</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Position Size</div>
                        <div className="text-white">25%</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Stop Loss</div>
                        <div className="text-white">2%</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Take Profit</div>
                        <div className="text-white">5%</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400 flex items-center gap-2">
                          <BellRing className="w-4 h-4" />
                          Notifications
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={notificationsEnabled} 
                            onCheckedChange={(checked) => {
                              setNotificationsEnabled(checked);
                              if (checked) setShowNotificationSettings(true);
                            }} 
                          />
                          {notificationsEnabled && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-7 px-2"
                              onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Configure
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Notification Settings Panel */}
                      {notificationsEnabled && showNotificationSettings && (
                        <div className="mt-4 bg-gray-800/50 rounded-md p-4 border border-gray-700 space-y-4">
                          <h4 className="text-sm font-medium text-neon-cyan flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Notification Settings
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="telegram" className="text-xs text-gray-400">Telegram Handle</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="telegram"
                                  value={telegramHandle}
                                  onChange={(e) => setTelegramHandle(e.target.value)}
                                  placeholder="@your_telegram"
                                  className="bg-gray-900 border-gray-700 text-white text-sm h-8"
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs h-8"
                                  onClick={() => alert('Test notification sent to ' + telegramHandle)}
                                >
                                  Test
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-xs text-gray-400">Update Frequency</Label>
                              <RadioGroup 
                                value={notificationFrequency} 
                                onValueChange={setNotificationFrequency}
                                className="flex gap-4 flex-wrap"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="realtime" id="realtime" className="h-3 w-3" />
                                  <Label htmlFor="realtime" className="text-xs">Real-time</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="hourly" id="hourly" className="h-3 w-3" />
                                  <Label htmlFor="hourly" className="text-xs">Hourly</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="daily" id="daily" className="h-3 w-3" />
                                  <Label htmlFor="daily" className="text-xs">Daily</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="trades" id="trades" className="h-3 w-3" />
                                  <Label htmlFor="trades" className="text-xs">Trades Only</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-xs text-gray-400">Notification Types</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center">
                                  <input type="checkbox" id="trades" className="mr-2" checked />
                                  <Label htmlFor="trades" className="text-xs">Trades</Label>
                                </div>
                                <div className="flex items-center">
                                  <input type="checkbox" id="balance" className="mr-2" checked />
                                  <Label htmlFor="balance" className="text-xs">Balance Changes</Label>
                                </div>
                                <div className="flex items-center">
                                  <input type="checkbox" id="alerts" className="mr-2" checked />
                                  <Label htmlFor="alerts" className="text-xs">Market Alerts</Label>
                                </div>
                                <div className="flex items-center">
                                  <input type="checkbox" id="errors" className="mr-2" checked />
                                  <Label htmlFor="errors" className="text-xs">Errors & Warnings</Label>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => setShowNotificationSettings(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="text-xs bg-neon-cyan text-black"
                              onClick={() => {
                                alert('Notification settings saved!');
                                setShowNotificationSettings(false);
                              }}
                            >
                              Save Settings
                            </Button>
                          </div>
                        </div>
                      )}
                      <div className="border-t border-gray-700 my-4 pt-4">
                        <p className="text-xs text-gray-400 mb-2">{strategy.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {strategy.tags && strategy.tags.map((tag: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-center gap-3 mt-6">
            {isDeployed && (
              <>
                <Button 
                  variant="outline"
                  className="border-neon-pink text-neon-pink hover:bg-neon-pink/20"
                  onClick={() => {
                    if (!notificationsEnabled) {
                      setNotificationsEnabled(true);
                    }
                    setShowNotificationSettings(true);
                    // Scroll to the settings tab
                    document.querySelector('[value="settings"]')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Configure Notifications
                </Button>
                <Button 
                  onClick={handleShare}
                  className="bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Bot
                </Button>
              </>
            )}
            <Button 
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeploymentModal;
