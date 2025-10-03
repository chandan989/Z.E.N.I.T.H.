import { useState, useEffect, useContext } from 'react';
import { WalletContext } from '@/contexts/WalletContext';
import * as contracts from '@/lib/contracts';

export function useContracts() {
  const walletContext = useContext(WalletContext);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (walletContext?.address && window.ethereum) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [walletContext?.address]);

  return {
    isReady,
    address: walletContext?.address,
    ...contracts
  };
}
