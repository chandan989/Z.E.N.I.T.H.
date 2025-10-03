# 🚀 Z.E.N.I.T.H. Deployment Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- MetaMask wallet with Doma testnet configured
- Vercel account (for deployment)

## 🔧 Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/chandan989/Z.E.N.I.T.H..git
cd Z.E.N.I.T.H.

# Frontend
cd zenith-web && npm install

# Smart Contracts
cd ../hardhat && npm install

# API
cd ../api && npm install
```

### 2. Environment Configuration
```bash
# Copy environment files
cp hardhat/.env.example hardhat/.env

# Edit hardhat/.env with your private key
# PRIVATE_KEY="your_wallet_private_key_here"
```

### 3. Start Development Servers
```bash
# Terminal 1: Frontend
cd zenith-web && npm run dev

# Terminal 2: API
cd api && npm run dev

# Terminal 3: Auto-fulfill bot (optional)
cd hardhat && npx hardhat run scripts/auto-fulfill.js --network doma
```

## 🌐 Vercel Deployment

### Frontend Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd zenith-web
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_GENESIS_ENGINE_ADDRESS=0x3C55823414683725Ee1ae7258E63406bef16A875
# VITE_DOMAIN_NFT_ADDRESS=0xbE044DCF939A1a968D8085Caa0ac1758F8BDe6C6
# VITE_FRACTIONALIZER_ADDRESS=0x8146A9122F805c8cCf0881564289Fd10678f7De6
# VITE_EXCHANGE_ADDRESS=0xc9dE8087935FF4fa4BF7d00B4240CA76Ec3d6A03
# VITE_CONSTELLATION_MANAGER_ADDRESS=0xDA5452Ff45879fBc7dB100D055Da5FB54aFC0c77
# VITE_CHAIN_ID=97476
# VITE_RPC_URL=https://rpc-testnet.doma.xyz
```

### API Deployment
```bash
cd api
vercel --prod
```

## 🔗 Contract Addresses (Doma Testnet)

| Contract | Address |
|----------|---------|
| GenesisEngine | `0x3C55823414683725Ee1ae7258E63406bef16A875` |
| DomainNFT | `0xbE044DCF939A1a968D8085Caa0ac1758F8BDe6C6` |
| Fractionalizer | `0x8146A9122F805c8cCf0881564289Fd10678f7De6` |
| Exchange | `0xc9dE8087935FF4fa4BF7d00B4240CA76Ec3d6A03` |
| ConstellationManager | `0xDA5452Ff45879fBc7dB100D055Da5FB54aFC0c77` |

## 🧪 Testing Deployment

### 1. Test Smart Contracts
```bash
cd hardhat
npx hardhat test
npx hardhat run scripts/check-status.js --network doma
```

### 2. Test Frontend
- Visit your deployed URL
- Connect MetaMask to Doma testnet
- Try onboarding a domain
- Check Exchange and Constellation pages

### 3. Test API
```bash
curl https://your-api-url.vercel.app/health
```

## 🔧 Troubleshooting

### Common Issues

1. **MetaMask Network Error**
   - Ensure Doma testnet is added with Chain ID 97476
   - Check RPC URL: `https://rpc-testnet.doma.xyz`

2. **Contract Interaction Fails**
   - Verify contract addresses in config files
   - Check wallet has sufficient ETH for gas

3. **Build Errors on Vercel**
   - Ensure all environment variables are set
   - Check Node.js version compatibility

### Debug Commands
```bash
# Check contract deployment
npx hardhat run scripts/check-status.js --network doma

# Verify network connection
curl -X POST https://rpc-testnet.doma.xyz \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

## 📱 Production Checklist

- [ ] All contracts deployed and verified
- [ ] Frontend deployed to Vercel
- [ ] API deployed to Vercel
- [ ] Environment variables configured
- [ ] MetaMask network added
- [ ] Auto-fulfill bot running
- [ ] Domain onboarding tested
- [ ] Exchange functionality tested
- [ ] Portfolio view tested

## 🚀 Go Live!

Once everything is tested and working:

1. Update README with production URLs
2. Share contract addresses with users
3. Provide MetaMask setup instructions
4. Monitor auto-fulfill bot logs
5. Test with real domain onboarding

Your Z.E.N.I.T.H. Protocol is now live! 🌟