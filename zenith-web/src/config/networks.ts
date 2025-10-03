// Doma Network Configuration
export const DOMA_TESTNET = {
  chainId: '0x17CC4', // 97476 in hex - Doma testnet
  chainName: 'Doma Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-testnet.doma.xyz'],
  blockExplorerUrls: ['https://explorer-testnet.doma.xyz'],
};

export const DOMA_MAINNET = {
  chainId: '0x3E8', // 1000 in hex - UPDATE THIS
  chainName: 'Doma Protocol',
  nativeCurrency: {
    name: 'DOMA',
    symbol: 'DOMA',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.doma.xyz'], // UPDATE WITH CORRECT RPC
  blockExplorerUrls: ['https://explorer.doma.xyz'], // UPDATE WITH CORRECT EXPLORER
};

// Helper function to add network to MetaMask
export async function addDomaNetwork(isTestnet = true) {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const network = isTestnet ? DOMA_TESTNET : DOMA_MAINNET;

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [network],
    });
    return true;
  } catch (error) {
    console.error('Failed to add network:', error);
    throw error;
  }
}

// Helper function to switch to Doma network
export async function switchToDomaNetwork(isTestnet = true) {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const chainId = isTestnet ? DOMA_TESTNET.chainId : DOMA_MAINNET.chainId;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    return true;
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      return await addDomaNetwork(isTestnet);
    }
    throw error;
  }
}
