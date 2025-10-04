# 🚀 DEPLOY NOW - Quick Guide

## Step 1: Redeploy Contracts (2 minutes)

```bash
cd hardhat

# Compile
npx hardhat compile

# Deploy to Doma testnet
npx hardhat run scripts/deploy.js --network doma
```

**SAVE ALL ADDRESSES!** You'll see:
```
DomainNFT deployed to: 0x...
Fractionalizer deployed to: 0x...
GenesisEngine deployed to: 0x...
Exchange (ETH) deployed to: 0x...
ConstellationManager deployed to: 0x...
```

---

## Step 2: Update Frontend Config (1 minute)

Edit `zenith-web/src/config/contracts.ts`:

Replace the addresses with your NEW ones from Step 1.

---

## Step 3: Start Auto-Fulfill Bot (30 seconds)

**Terminal 1:**
```bash
cd hardhat
npx hardhat run scripts/auto-fulfill.js --network doma
```

**Keep this running!** It auto-processes requests.

---

## Step 4: Start Frontend (30 seconds)

**Terminal 2:**
```bash
cd zenith-web
npm run dev
```

Open http://localhost:5173

---

## Step 5: Test Everything (5 minutes)

### Test 1: Tokenize Domain
1. Connect MetaMask (Doma testnet)
2. Go to Genesis Engine
3. Enter: `mydomain.com`
4. Complete flow
5. Click "Confirm & Mint"
6. **MetaMask popup** → Approve
7. Watch Terminal 1 (auto-fulfill bot processes it)
8. Success! You get tokens!

### Test 2: Trade
1. Go to Exchange
2. Select your token
3. Create sell order:
   - Amount: 100
   - Price: 0.01 (ETH)
4. **MetaMask popup** → Approve tokens
5. **MetaMask popup** → Create order
6. Order appears in order book!

### Test 3: Portfolio
1. Go to My Constellation
2. See your tokens
3. Check balances

---

## 🎥 For Demo Recording

**Show:**
- ✅ Frontend UI (beautiful)
- ✅ MetaMask popups (real transactions)
- ✅ Auto-fulfill bot logs (automation)
- ✅ Block explorer (on-chain proof)
- ✅ Order book (live trading)

**Emphasize:**
- "All transactions on Doma Protocol"
- "Real blockchain integration"
- "Professional trading interface"
- "AI-powered valuations"
- "Portfolio management tools"

---

## 📊 Collect Metrics

After testing, note:
- Number of transactions: [X]
- Domains tokenized: [X]
- Orders created: [X]
- Gas used: [X ETH]
- Block explorer links: [URLs]

---

## ✅ Ready to Deploy?

Run these commands in order:

```bash
# 1. Deploy
cd hardhat && npx hardhat run scripts/deploy.js --network doma

# 2. Update frontend config with new addresses

# 3. Start bot
npx hardhat run scripts/auto-fulfill.js --network doma

# 4. Start frontend (new terminal)
cd zenith-web && npm run dev

# 5. Test and record demo!
```

**GO! 🚀**
