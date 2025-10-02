
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      // Handle case where MetaMask is not installed
      console.log("MetaMask not detected");
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking for MetaMask connection", error);
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ address, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
