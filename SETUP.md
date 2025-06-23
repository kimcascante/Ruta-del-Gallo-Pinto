# 🎮 Dojo Game Starter - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- mkcert (for HTTPS development)

### 1. Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install mkcert for HTTPS (required for Cartridge Controller)
# On macOS:
brew install mkcert
mkcert -install

# On Windows:
choco install mkcert
mkcert -install

# On Linux:
sudo apt install mkcert
mkcert -install
```

### 2. Start the Application

```bash
# Generate certificates and start development server
npm run mkcert
npm run dev:https
```

The application will be available at: `https://localhost:5173`

### 3. Connect and Play

1. **Connect Controller**: Click "Connect Controller" to open Cartridge Controller
2. **Create Player**: Your player will be automatically created on first connection
3. **Start Playing**: Use the game actions to train, mine, and rest
4. **Track Progress**: Monitor your stats and achievements

## 🎯 Game Features

### Core Actions
- **🏋️ Train**: +10 Experience (Pure advancement)
- **⛏️ Mine**: +5 Coins, -5 Health (Risk/reward)
- **💤 Rest**: +20 Health (Resource management)

### Achievement System
- **MiniGamer** (1 action) → **SenseiGamer** (50 actions)
- Automatic progress tracking
- Visual achievement display

### Real-time Features
- Optimistic UI updates
- Background blockchain confirmation
- Session policies for seamless gameplay

## 🔧 Development

### Local Blockchain Setup (Optional)

If you want to run with a local blockchain:

```bash
# Terminal 1: Start Katana
cd contract
katana --config katana.toml

# Terminal 2: Deploy contracts
sozo build
sozo migrate

# Terminal 3: Start Torii
torii --world <WORLD_ADDRESS> --http.cors_origins "*"

# Terminal 4: Update client config
# Create .env.development.local in client/ with:
VITE_PUBLIC_DEPLOY_TYPE=localhost
VITE_PUBLIC_NODE_URL=http://localhost:5050
VITE_PUBLIC_TORII=http://localhost:8080
```

### Production Deployment

The app is configured to connect to Sepolia testnet by default. For production:

1. Deploy contracts to mainnet
2. Update environment variables
3. Deploy frontend to your hosting platform

## 🎨 Customization

### Adding New Actions
1. Update Cairo contracts in `contract/src/systems/game.cairo`
2. Add new hooks in `client/src/dojo/hooks/`
3. Update UI components in `client/src/components/`

### Styling
- Uses TailwindCSS for styling
- Custom components in `client/src/components/ui/`
- Responsive design with mobile-first approach

### Assets
- Game assets in `client/src/assets/`
- Contract assets in `contract/assets/`

## 🐛 Troubleshooting

### HTTPS Issues
```bash
# Regenerate certificates
npm run mkcert
```

### Connection Issues
- Ensure Cartridge Controller is installed
- Check network connectivity
- Verify environment variables

### Contract Issues
- Check if contracts are deployed
- Verify Torii indexer is running
- Check browser console for errors

## 📚 Documentation

- **[Client Documentation](./client/README.md)** - Frontend development
- **[Contracts Documentation](./contract/README.md)** - Backend development
- **[Integration Guides](./client/docs/)** - Complete tutorials

## 🔗 Links

- **[Starknet](https://starknet.io)**
- **[Dojo Engine](https://dojoengine.org)**
- **[Cartridge](https://cartridge.gg)**
- **[Discord](https://discord.com/invite/dojoengine)**

---

**Ready to build the future of onchain gaming?** 🚀 