<div align="center">
  <img src="public/logo.svg" alt="Arbitra Logo" width="120" height="120">

  # Arbitra

  ### Algorithmic Trading Simplified
</div>

## 🤖 About Arbitra

Arbitra is a cutting-edge crypto trading bot platform designed to make algorithmic trading accessible to everyone. By combining powerful trading strategies with an intuitive user interface, Arbitra enables both beginners and experienced traders to deploy automated trading bots with confidence.

**Try it now:** [https://arbitra.netlify.app/](https://arbitra.netlify.app/)

## ✨ Key Features

- **Intelligent Strategy Recommendations** - AI-powered analysis of your trading preferences to suggest optimal strategies
- **10+ Trading Strategies** - Including Conservative Grid, Momentum Scalper, Neural Arbitrage, DCA Bot, and more
- **OKX Integration** - Seamless connectivity with OKX cryptocurrency exchange
- **Mock Trading** - Test strategies with real-time market data before deploying real capital
- **Advanced Price Charts** - TradingView-like charts with technical indicators and real-time updates
- **Customizable Notifications** - Telegram integration with configurable update frequency

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ardor05/arbitra.git

# Navigate to the project directory
cd arbitra

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🛠️ Technologies

Arbitra is built with a modern tech stack:

- **React** - UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast, modern build tool
- **Shadcn UI** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **OKX API** - Real-time market data and trading functionality

## 📋 Project Structure

```
src/
├── api/            # API clients for OKX and other services
├── components/     # UI components
├── pages/          # Application pages
│   ├── Landing.tsx           # Landing page with chatbot
│   ├── Recommendations.tsx   # Strategy recommendations
│   ├── MockTrading.tsx       # Mock trading simulator
│   └── Deployment.tsx        # Bot deployment and monitoring
└── utils/          # Utility functions
```

## 🔍 Features in Depth

### 1. Strategy Recommendation System

Our AI-powered recommendation engine analyzes user preferences collected through a guided conversation to suggest optimal trading strategies based on risk tolerance, trading frequency, and preferred assets.

### 2. Mock Trading Simulation

Test trading strategies with real-time market data from OKX without risking real capital. The simulation provides detailed metrics including PnL, ROI, win rate, and trade history.

### 3. OKX Integration

Seamlessly connect to OKX cryptocurrency exchange for wallet connectivity, real-time price data, and trading execution.

### 4. Custom Notifications

Receive alerts via Telegram with customizable frequency (real-time, hourly, daily) and notification types (trades, balance changes, market alerts, errors).

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any inquiries, please open an issue on this repository.
