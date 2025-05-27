
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bot, Activity, Share2, Bell, Edit, CheckCircle, AlertCircle, ChevronDown, Copy, CreditCard, BarChart3, ArrowRight, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Deployment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [mockResults, setMockResults] = useState<any>(null);
  
  // Get stored data from localStorage as fallback
  useEffect(() => {
    // Try to get from location state first
    if (location.state?.selectedStrategy) {
      setSelectedStrategy(location.state.selectedStrategy);
    } else {
      // Fallback to localStorage
      try {
        const storedStrategy = localStorage.getItem('selectedStrategy');
        if (storedStrategy) {
          setSelectedStrategy(JSON.parse(storedStrategy));
        }
      } catch (error) {
        console.error('Error loading strategy from localStorage:', error);
      }
    }
    
    // Set mock results
    if (location.state?.mockResults) {
      setMockResults(location.state.mockResults);
    } else {
      // Generate some mock results if none are provided
      setMockResults({
        pnl: Math.random() * 1000 - 200,
        trades: Math.floor(Math.random() * 50) + 10,
        winRate: Math.random() * 30 + 60,
        estimatedReturn: Math.random() * 25 + 5
      });
    }
  }, [location.state]);
  
  const [isDeployed, setIsDeployed] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState({
    activeTrades: 0,
    dailyPnL: 0,
    uptime: '0h 0m',
    totalTrades: 0,
    balance: 10000,
    equity: 10000
  });
  
  // OKX Integration
  const [okxConnected, setOkxConnected] = useState(false);
  const [autoTrading, setAutoTrading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Simulate deployment progress
  useEffect(() => {
    if (!isDeployed && deploymentProgress < 100) {
      const timer = setTimeout(() => {
        setDeploymentProgress(prev => Math.min(100, prev + 10));
      }, 500);
      return () => clearTimeout(timer);
    } else if (deploymentProgress === 100 && !isDeployed) {
      setIsDeployed(true);
    }
  }, [deploymentProgress, isDeployed]);

  // Simulate live metrics
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDeployed) {
      // Connect to OKX after deployment
      setOkxConnected(true);
      
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
        ].slice(-100)); // Keep last 100 logs
      }, 5000);
      
      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
    return () => {};
  }, [isDeployed]);
  
  // Generate execution logs with timestamps
  const [executionLogs, setExecutionLogs] = useState<Array<{time: string, message: string, type: string}>>([]);
  
  const generateExecutionLog = () => {
    const types = ['info', 'success', 'warning', 'error'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const infoMessages = [
      `Analyzing market conditions for ${selectedStrategy?.name}`,
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

  const handleDeploy = () => {
    setDeploymentProgress(1);
    
    // Generate initial deployment logs
    setExecutionLogs([
      { time: getCurrentTime(), message: 'Initializing deployment process', type: 'info' },
      { time: getCurrentTime(), message: 'Connecting to OKX trading platform', type: 'info' },
      { time: getCurrentTime(), message: 'Validating API credentials', type: 'info' }
    ]);
  };
  
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/bot/${selectedStrategy?.name.toLowerCase().replace(/\s+/g, '-')}`;
    await navigator.clipboard.writeText(shareUrl);
    alert('Bot link copied to clipboard!');
  };

  if (!selectedStrategy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 flex items-center justify-center">
        <Card className="glass-morphism border-gray-800 p-8 text-center">
          <CardContent>
            <p className="text-gray-400">No strategy data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-neon-cyan to-neon-green rounded-2xl flex items-center justify-center glass-morphism">
              <Bot className="w-10 h-10 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-green to-neon-purple">
            Deployment
          </h1>
          <p className="text-lg text-gray-400">
            Deploy your trading bot to OKX cryptocurrency exchange
          </p>
          <Badge variant="outline" className={`border-${selectedStrategy.color} text-${selectedStrategy.color} bg-${selectedStrategy.color}/10`}>
            {selectedStrategy.name}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Realtime Analytics */}
          <Card className="glass-morphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-neon-cyan flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Trading Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isDeployed ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400">Active Trades</div>
                    <div className="text-neon-green">{liveMetrics.activeTrades}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400">Total Trades</div>
                    <div className="text-white">{liveMetrics.totalTrades}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400">Daily P&L</div>
                    <div className={liveMetrics.dailyPnL >= 0 ? "text-neon-green" : "text-red-500"}>
                      {liveMetrics.dailyPnL >= 0 ? '+' : ''}{liveMetrics.dailyPnL.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400">Uptime</div>
                    <div className="text-neon-cyan">{liveMetrics.uptime}</div>
                  </div>
                  
                  <div className="pt-4 text-xl font-semibold text-neon-green">
                    <CheckCircle className="w-5 h-5 inline-block mr-2" /> 
                    Bot Active & Trading
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-2">
                  <BarChart3 className="w-6 h-6 text-gray-400 mx-auto" />
                  <div className="text-gray-400">No performance data</div>
                  <div className="text-sm text-gray-500">Deploy your bot to see analytics</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Execution Logs */}
          <Card className="glass-morphism border-gray-800 lg:col-span-3">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-neon-green">OKX Trading Execution Logs</CardTitle>
              {isDeployed && (
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh Logs
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 p-4 rounded-md h-80 overflow-y-auto font-mono text-xs text-gray-300">
                {deploymentProgress > 0 ? (
                  <div className="space-y-1">
                    {/* Deployment progress logs */}
                    {deploymentProgress < 100 && (
                      <>
                        <div className="text-neon-cyan">[{getCurrentTime()}] Initializing deployment to OKX exchange</div>
                        <div className="text-neon-cyan">[{getCurrentTime()}] Connecting to OKX API</div>
                        <div className="text-neon-cyan">[{getCurrentTime()}] Validating strategy parameters</div>
                        {deploymentProgress > 30 && (
                          <div className="text-neon-green">[{getCurrentTime()}] Strategy validated successfully</div>
                        )}
                        {deploymentProgress > 50 && (
                          <div className="text-neon-green">[{getCurrentTime()}] OKX platform connection established</div>
                        )}
                        {deploymentProgress > 80 && (
                          <div className="text-neon-cyan">[{getCurrentTime()}] Deploying trading algorithms to OKX...</div>
                        )}
                      </>
                    )}
                    
                    {/* Real-time execution logs */}
                    {isDeployed && executionLogs.map((log, index) => (
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
                ) : (
                  <div className="text-gray-500 text-center py-16 flex flex-col items-center gap-2">
                    <Bot className="w-8 h-8 opacity-50" />
                    <div>OKX Trading execution logs will appear here after deployment</div>
                    <div className="text-xs opacity-70">Deploy your strategy to connect to the OKX platform</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Mock Results Summary */}
        {mockResults && (
          <Card className="glass-morphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-neon-green">Mock Trading Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-green">{mockResults.pnl >= 0 ? '+' : ''}${mockResults.pnl.toFixed(2)}</div>
                  <div className="text-gray-400 text-sm">Final P&L</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan">{mockResults.trades}</div>
                  <div className="text-gray-400 text-sm">Total Trades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-purple">{mockResults.winRate.toFixed(1)}%</div>
                  <div className="text-gray-400 text-sm">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-pink">{mockResults.estimatedReturn.toFixed(2)}%</div>
                  <div className="text-gray-400 text-sm">Return</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {!isDeployed && deploymentProgress === 0 && (
            <Button 
              onClick={handleDeploy}
              className="bg-gradient-to-r from-neon-green to-neon-cyan text-black font-bold px-8 py-3 text-lg"
            >
              Deploy to OKX Live Trading
            </Button>
          )}

          {deploymentProgress > 0 && deploymentProgress < 100 && (
            <div className="text-center">
              <div className="text-neon-cyan mb-2">Connecting to OKX... {deploymentProgress}%</div>
              <div className="w-64 bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-neon-cyan to-neon-green h-2 rounded-full transition-all duration-500"
                  style={{ width: `${deploymentProgress}%` }}
                />
              </div>
            </div>
          )}

          {isDeployed && (
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline"
                className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
                onClick={() => navigate('/recommendations')}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Strategy
              </Button>
              <Button 
                onClick={handleShare}
                className="bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Strategy
              </Button>
              <Button 
                variant="outline"
                className="border-neon-pink text-neon-pink hover:bg-neon-pink/20"
                onClick={() => {
                  setNotificationsEnabled(!notificationsEnabled);
                  alert('Notification preferences updated!');
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                {notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
              </Button>
              <Button 
                className="bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold"
                onClick={() => window.open('https://web3.okx.com/portfolio', '_blank')}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to OKX Platform
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deployment;
