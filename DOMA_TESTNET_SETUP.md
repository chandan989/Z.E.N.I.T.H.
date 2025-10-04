# 🦊 Connect to Doma Testnet - Quick Guide

## Step 1: Find Correct Network Details

**Visit Doma Documentation:**
- https://docs.doma.xyz/
- https://start.doma.xyz/

**Look for:**
- Testnet RPC URL
- Chain ID
- Block Explorer URL
- Faucet link

---

## Step 2: Add Network to MetaMask

### **Manual Method:**

1. Open MetaMask
2. Click network dropdown (top left)
3. Click "Add Network" → "Add a network manually"
4. Enter details (get from Doma docs):

```
Network Name: Doma Testnet
RPC URL: [FROM DOMA DOCS]
Chain ID: [FROM DOMA DOCS]
Currency Symbol: DOMA
Block Explorer: [FROM DOMA DOCS]
```

5. Click "Save"

---

### **Automatic Method (Using Frontend):**

Once you connect your wallet, if you're on the wrong network, you'll see:

```
⚠️ Switch to Doma
```

Click it to automatically add/switch to Doma testnet!

---

## Step 3: Get Testnet Tokens

1. Visit Doma Faucet (check docs for link)
2. Enter your wallet address
3. Request testnet tokens
4. Wait for confirmation

**Alternative:**
- Check Doma Discord for faucet bot
- Ask in #faucet or #testnet channel

---

## Step 4: Verify Connection

**Check MetaMask:**
- Network shows "Doma Testnet"
- You have testnet tokens
- Can see transactions on block explorer

**Check Frontend:**
- No "Switch to Doma" warning
- Wallet address shows in header
- Can interact with contracts

---

## 🔧 Troubleshooting

### "Wrong Network" Warning Won't Go Away

**Solution:**
1. Manually switch to Doma Testnet in MetaMask
2. Refresh the page
3. Reconnect wallet

### Can't Add Network

**Solution:**
1. Check RPC URL is correct
2. Try different RPC endpoint (check Doma docs)
3. Clear MetaMask cache: Settings → Advanced → Reset Account

### No Testnet Tokens

**Solution:**
1. Visit faucet again
2. Check Doma Discord for help
3. Ask in community channels

### Transactions Failing

**Solution:**
1. Check you're on correct network
2. Check you have enough testnet tokens for gas
3. Try increasing gas limit
4. Check contract addresses are correct

---

## 📋 Quick Reference

**Update these values in your code:**

`zenith-web/src/config/networks.ts`:
```typescript
export const DOMA_TESTNET = {
  chainId: '0x???', // Get from Doma docs
  rpcUrls: ['https://rpc-testnet.doma.xyz'], // Get from Doma docs
  // ... other values
};
```

`zenith-web/src/components/Header.tsx`:
```typescript
const DOMA_TESTNET_CHAIN_ID = '0x???'; // Match the chainId above
```

---

## 🚀 Ready to Deploy?

Once connected:
1. ✅ MetaMask on Doma Testnet
2. ✅ Have testnet tokens
3. ✅ Frontend shows correct network
4. ✅ Can interact with contracts

**Deploy contracts:**
```bash
cd hardhat
npx hardhat run scripts/deploy.js --network doma
```

**Update frontend with contract addresses**

**Test the full flow!**

---

## 📞 Need Help?

- **Doma Discord:** https://discord.com/invite/doma
- **Doma Docs:** https://docs.doma.xyz/
- **Doma X:** https://x.com/domaprotocol

Post in #hackathon channel for quick help!
