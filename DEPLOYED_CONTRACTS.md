# 🚀 Z.E.N.I.T.H. Protocol - Deployed Contracts

**Network:** Doma Testnet  
**Chain ID:** 97476  
**Deployment Date:** October 4, 2025

---

## 📋 Contract Addresses

### Core Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| **DomainNFT** | `0xAD6655fa10DB0DDDc079774198E76c457E2e0C8C` | ERC-721 tokens for domains |
| **Fractionalizer** | `0x88f89504F32A1439B44e7aaad3AAAd6dA5BBc13e` | Converts NFTs to ERC-20 shares |
| **GenesisEngine** | `0xc82abc101a87De2c127cc3c603b8D2aF237D8dA6` | Onboarding orchestrator |
| **Exchange** | `0x47CdC4Fb0B1f1d6a7Bbd5A21206B1c832188EFD6` | Order book DEX |
| **ConstellationManager** | `0x83aAEb4D645B698E1F16EeD494F1E3cBBc4071e1` | Portfolio baskets (ETF-like) |

---

## 🔗 Block Explorer Links

- **DomainNFT:** https://explorer-testnet.doma.xyz/address/0xAD6655fa10DB0DDDc079774198E76c457E2e0C8C
- **Fractionalizer:** https://explorer-testnet.doma.xyz/address/0x88f89504F32A1439B44e7aaad3AAAd6dA5BBc13e
- **GenesisEngine:** https://explorer-testnet.doma.xyz/address/0xc82abc101a87De2c127cc3c603b8D2aF237D8dA6
- **Exchange:** https://explorer-testnet.doma.xyz/address/0x47CdC4Fb0B1f1d6a7Bbd5A21206B1c832188EFD6
- **ConstellationManager:** https://explorer-testnet.doma.xyz/address/0x83aAEb4D645B698E1F16EeD494F1E3cBBc4071e1

---

## ✅ Deployment Status

- [x] All contracts deployed successfully
- [x] Addresses set in GenesisEngine
- [x] Minting roles granted
- [ ] Payment token deployed (next step)
- [ ] Addresses locked
- [ ] Frontend updated with addresses

---

## 🎯 Next Steps

### 1. Deploy Test Payment Token (USDC)

```bash
npx hardhat run scripts/configure.js --network doma
```

This will:
- Deploy test USDC token
- Set payment token in Exchange
- Lock addresses in GenesisEngine

### 2. Update Frontend

Already done! Contract addresses saved in:
- `zenith-web/src/config/contracts.ts`

### 3. Test the System

```bash
# Start frontend
cd zenith-web
npm run dev

# Connect MetaMask to Doma testnet
# Test full workflow:
# 1. Tokenize a domain
# 2. Trade on exchange
# 3. Create constellation
```

### 4. Verify Contracts (Optional)

```bash
npx hardhat verify --network doma 0xAD6655fa10DB0DDDc079774198E76c457E2e0C8C
npx hardhat verify --network doma 0x88f89504F32A1439B44e7aaad3AAAd6dA5BBc13e "0xAD6655fa10DB0DDDc079774198E76c457E2e0C8C"
npx hardhat verify --network doma 0xc82abc101a87De2c127cc3c603b8D2aF237D8dA6
npx hardhat verify --network doma 0x47CdC4Fb0B1f1d6a7Bbd5A21206B1c832188EFD6
npx hardhat verify --network doma 0x83aAEb4D645B698E1F16EeD494F1E3cBBc4071e1 "0xAD6655fa10DB0DDDc079774198E76c457E2e0C8C"
```

---

## 📊 For Hackathon Submission

**Deployed Contracts on Doma Testnet:**

```
DomainNFT: 0xAD6655fa10DB0DDDc079774198E76c457E2e0C8C
Fractionalizer: 0x88f89504F32A1439B44e7aaad3AAAd6dA5BBc13e
GenesisEngine: 0xc82abc101a87De2c127cc3c603b8D2aF237D8dA6
Exchange: 0x47CdC4Fb0B1f1d6a7Bbd5A21206B1c832188EFD6
ConstellationManager: 0x83aAEb4D645B698E1F16EeD494F1E3cBBc4071e1
```

**Network:** Doma Testnet (Chain ID: 97476)

---

## 🎥 Demo Checklist

- [ ] Record video walkthrough
- [ ] Show Genesis Engine (tokenize domain)
- [ ] Show Exchange (create/fill orders)
- [ ] Show Constellation creation
- [ ] Show all transactions on block explorer
- [ ] Collect metrics (txns, users, volume)

---

## 🏆 Hackathon Submission Links

- **GitHub:** [Your repo URL]
- **Demo Video:** [YouTube/Loom link]
- **Live Demo:** [Deployed frontend URL]
- **X/Twitter:** [Your project Twitter]
- **Block Explorer:** https://explorer-testnet.doma.xyz/

---

**🎉 Congratulations! Your contracts are live on Doma testnet!**
