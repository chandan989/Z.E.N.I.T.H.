# 🔄 After Redeployment - Update These Files

## 1. Update Contract Addresses

Edit `zenith-web/src/config/contracts.ts`:

```typescript
export const CONTRACTS = {
  domainNFT: "0x...", // NEW ADDRESS from deployment
  fractionalizer: "0x...", // NEW ADDRESS
  genesisEngine: "0x...", // NEW ADDRESS
  exchange: "0x...", // NEW ExchangeETH ADDRESS
  constellationManager: "0x...", // NEW ADDRESS
  paymentToken: "0x0000000000000000000000000000000000000000", // Native ETH
};
```

## 2. Start Auto-Fulfill Bot

In a separate terminal:

```bash
cd hardhat
npx hardhat run scripts/auto-fulfill.js --network doma
```

Keep this running! It will automatically fulfill onboarding requests.

## 3. Test the Flow

1. **Start Frontend:**
   ```bash
   cd zenith-web
   npm run dev
   ```

2. **Connect MetaMask** (Doma testnet)

3. **Tokenize a Domain:**
   - Go to Genesis Engine
   - Enter domain: `test.com`
   - Complete steps
   - Click "Confirm & Mint"
   - **MetaMask popup** → Approve
   - **Auto-fulfill bot** will process it automatically!
   - Wait ~10 seconds
   - You'll receive tokens!

4. **Trade on Exchange:**
   - Go to Exchange
   - Create sell order
   - **MetaMask popup** → Approve tokens
   - **MetaMask popup** → Create order
   - Order appears in order book!

## 4. For Demo Video

**Terminal Setup:**
- Terminal 1: Frontend (`npm run dev`)
- Terminal 2: Auto-fulfill bot (`auto-fulfill.js`)
- Terminal 3: Available for commands

**Show:**
- Frontend UI
- MetaMask popups
- Auto-fulfill bot logs
- Block explorer transactions
- Order book updates

This makes for an impressive demo! 🎥
