import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";
import MetaMaskDialog from "./MetaMaskDialog";
import { switchToDomaNetwork } from "../config/networks";

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const walletContext = useContext(WalletContext);
  const [isMetaMaskDialogOpen, setMetaMaskDialogOpen] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  const DOMA_TESTNET_CHAIN_ID = '0x17CA4'; // 97476 in hex - Doma testnet

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current Chain ID:', currentChainId);
        console.log('Expected Chain ID:', DOMA_TESTNET_CHAIN_ID);
        setChainId(currentChainId);
        
        // Convert both to numbers for comparison
        const current = parseInt(currentChainId, 16);
        const expected = parseInt(DOMA_TESTNET_CHAIN_ID, 16);
        console.log('Current (decimal):', current, 'Expected (decimal):', expected);
        
        // Temporarily disable network check for testing
        setWrongNetwork(false); // Always show as correct network
      }
    };

    checkNetwork();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (newChainId: string) => {
        setChainId(newChainId);
        setWrongNetwork(newChainId !== DOMA_TESTNET_CHAIN_ID);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const handleSwitchNetwork = async () => {
    try {
      await switchToDomaNetwork(true);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      await walletContext?.connectWallet();
    } else {
      setMetaMaskDialogOpen(true);
    }
  };

  const navItems = [
    // { name: "Mission Control", path: "/" },
    { name: "Genesis Engine", path: "/genesis" },
    { name: "Exchange", path: "/exchange" },
    { name: "My Constellation", path: "/constellation" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-8 bg-void-black/80 backdrop-blur-lg transition-all duration-300 ${scrolled ? 'py-4' : 'py-8'}`}>
        <Link to="/" className="relative flex items-center space-x-2 cursor-pointer">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest font-data">
                Z<span className="text-celestial-blue/70">.</span>E<span className="text-celestial-blue/70">.</span>N<span className="text-celestial-blue/70">.</span>I<span className="text-celestial-blue/70">.</span>T<span className="text-celestial-blue/70">.</span>H
            </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-colors duration-300 ${
                isActive(item.path)
                  ? "text-white"
                  : "text-stardust-grey hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {wrongNetwork && walletContext?.address && (
            <button 
              onClick={handleSwitchNetwork}
              className="bg-red-500/20 border border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 hover:bg-red-500/30 flex items-center space-x-2"
            >
              <span>⚠️ Switch to Doma</span>
            </button>
          )}
          <button onClick={handleConnectWallet} id="connect-wallet-button" className="bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 glow-blue-hover transform hover:scale-105 flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
              <span>{walletContext?.address ? `${walletContext.address.substring(0, 6)}...${walletContext.address.substring(walletContext.address.length - 4)}` : "Connect Wallet"}</span>
          </button>
        </div>
        <MetaMaskDialog isOpen={isMetaMaskDialogOpen} onClose={() => setMetaMaskDialogOpen(false)} />
    </header>
  );
};

export default Header;
