# Z.E.N.I.T.H. Frontend Integration Guide

This document outlines how to connect the `zenith-web` React frontend to the suite of Solidity smart contracts.

## 1. Prerequisites

- **Web3 Library**: You will need a library like `ethers.js` or `viem` to interact with the Doma Protocol blockchain.
- **Provider**: A connection to the blockchain, injected by a browser wallet like MetaMask (`window.ethereum`).
- **Contract ABIs**: The Application Binary Interface (ABI) for each contract. These are JSON files generated during contract compilation.
- **Contract Addresses**: The unique addresses of the deployed smart contracts on the blockchain.

---

## 2. Connecting with MetaMask & User Identification

User identity is managed through their blockchain address, accessed via a browser wallet. Here’s the standard flow for connecting a user with MetaMask.

#### **Step 1: Detect MetaMask**

Check if the `window.ethereum` object is available.

```typescript
const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined';
};
```

#### **Step 2: Connect Wallet and Get User Address**

Create a function that prompts the user to connect their wallet. This will provide their address, which is their primary identifier across the application.

```typescript
import { ethers } from 'ethers';

// This function can be placed in a React context or a custom hook (e.g., useWallet)
async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    // Handle case where MetaMask is not installed
    alert("Please install MetaMask!");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Request account access
    const accounts = await provider.send("eth_requestAccounts", []);
    
    if (accounts.length > 0) {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      return { provider, signer, address };
    }
    return null;
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    return null;
  }
}
```

#### **Step 3: Handling Account and Network Changes**

It's crucial to listen for events from MetaMask to handle cases where the user switches accounts or networks. This ensures the app state is always current.

```typescript
// In a React component (e.g., inside a useEffect hook)

useEffect(() => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      // If the user disconnects or switches accounts, reload the app or update the state
      console.log("Account changed to:", accounts[0]);
      window.location.reload(); 
    });

    window.ethereum.on('chainChanged', (chainId: string) => {
      // Handle network changes, e.g., by prompting the user to switch to the correct network
      console.log("Network changed to:", chainId);
      window.location.reload();
    });
  }

  // Cleanup listeners on component unmount
  return () => {
    if (isMetaMaskInstalled()) {
      window.ethereum.removeAllListeners();
    }
  };
}, []);
```

---

## 3. Initial Setup with Ethers.js

Once the user is connected, you can initialize the contract instances.

```typescript
// Assume `wallet` is the object returned from `connectWallet()`
const { provider, signer, address } = wallet;

// Import ABIs and addresses as before...

// Create contract instances
const genesisEngine = new ethers.Contract(contractAddresses.genesisEngine, genesisEngineAbi, signer);
const exchange = new ethers.Contract(contractAddresses.exchange, exchangeAbi, signer);
const fractionalizer = new ethers.Contract(contractAddresses.fractionalizer, provider); // Use provider for read-only
const domainNFT = new ethers.Contract(contractAddresses.domainNFT, domainNftAbi, provider);

// To interact with a specific fractional token, create an instance dynamically:
const getFractionalTokenContract = (tokenAddr: string, withSigner = false) => {
  return new ethers.Contract(tokenAddr, fractionalTokenAbi, withSigner ? signer : provider);
};
```

---

## 4. Page-Specific Instructions

(...The rest of the guide remains the same...)

### `GenesisEngine.tsx`

- **Contracts Used**: `GenesisEngine.sol`

#### Workflow: Two-Step Onboarding

1.  **Requesting Onboarding (User Action)**
    -   When the user submits the form in Step 3 of the UI (`Configure Your Asset`):
    -   **Function Call**: Execute the `requestOnboarding` transaction.

    ```typescript
    const tx = await genesisEngine.requestOnboarding(
      domainName,      // "crypto.com"
      tokenName,       // "CryptoCom"
      tokenSymbol,     // "CRYPTO"
      tokenSupply,     // 1000000
      domaScore        // 940
    );
    await tx.wait(); // Wait for the transaction to be mined
    ```

2.  **Fulfilling Onboarding (Admin Action)**
    -   This is an **owner-only** function and would typically be called from a separate admin dashboard.

### `Exchange.tsx`

- **Contracts Used**: `Exchange.sol`, `FractionalToken.sol` (dynamic), `PaymentToken.sol` (e.g., USDC).

#### Reading Data

-   **Displaying the Order Book**:
    1.  Fetch the list of order IDs for the selected asset (`tokenAddress`):
        ```typescript
        const buyIds = await exchange.buyOrderIdsByToken(tokenAddress);
        const sellIds = await exchange.sellOrderIdsByToken(tokenAddress);
        ```
    2.  Fetch the details for each order ID:
        ```typescript
        const buyOrders = await Promise.all(buyIds.map(id => exchange.buyOrders(tokenAddress, id)));
        const sellOrders = await Promise.all(sellIds.map(id => exchange.sellOrders(tokenAddress, id)));
        ```

#### Writing Data (Placing Trades)

-   **Creating a Limit Order**:
    1.  **Approve**: Before creating the order, the user must grant an allowance.
    2.  **Function Call**: `exchange.createLimitOrder(tokenAddress, isBuyOrder, amount, price)`

-   **Filling an Order (Partial or Full)**:
    1.  **Approve**: The user taking the order must grant an allowance.
    2.  **Function Call**: `exchange.fillOrder(tokenAddress, orderIdToFill, isBuyOrderToFill, amountToFill)`

### `Constellation.tsx`

- **Contracts Used**: `Fractionalizer.sol`, `DomainNFT.sol`, `FractionalToken.sol` (dynamic).

#### Workflow: Building the Portfolio

1.  **Fetch All Assets**: `const allTokenAddresses = await fractionalizer.getAllFractionalTokens();`
2.  **Check User Balances**: For each `tokenAddress`, check `balanceOf(userAddress)`.
3.  **Fetch Asset Details**: For each owned asset, retrieve its metadata from `DomainNFT` and `Fractionalizer`.

### `StellarReport.tsx`

- **Contracts Used**: `DomainNFT.sol`, `Fractionalizer.sol`, `FractionalToken.sol`.

#### Reading On-Chain Data

-   Use the `tokenAddress` to query `domainName`, `domaScore`, and `totalSupply` from the contracts.

#### Reading Off-Chain Data

-   **Market Data** (`Price`, `Market Cap`, `24h Volume`) and **Holders** count should be fetched from a dedicated backend API that indexes blockchain events.
