// Contract addresses on Doma Testnet
// Deployed: [Current Date]

export const CONTRACTS = {
  // Core contracts
  domainNFT: "0xbE044DCF939A1a968D8085Caa0ac1758F8BDe6C6",
  fractionalizer: "0x8146A9122F805c8cCf0881564289Fd10678f7De6",
  genesisEngine: "0x3C55823414683725Ee1ae7258E63406bef16A875",
  exchange: "0xc9dE8087935FF4fa4BF7d00B4240CA76Ec3d6A03",
  constellationManager: "0xDA5452Ff45879fBc7dB100D055Da5FB54aFC0c77",
  
  // Payment token - NOT NEEDED! Using native ETH directly
  paymentToken: "0x0000000000000000000000000000000000000000", // Native ETH
};

// Network configuration
export const NETWORK = {
  chainId: 97476, // Doma testnet
  name: "Doma Testnet",
  rpcUrl: "https://rpc-testnet.doma.xyz",
  blockExplorer: "https://explorer-testnet.doma.xyz",
};

// Helper to get contract address
export function getContractAddress(contractName: keyof typeof CONTRACTS): string {
  const address = CONTRACTS[contractName];
  if (!address || address === "0x...") {
    console.warn(`Contract ${contractName} not configured yet`);
  }
  return address;
}
