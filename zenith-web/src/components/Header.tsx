import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";
import MetaMaskDialog from "./MetaMaskDialog";

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const walletContext = useContext(WalletContext);
  const [isMetaMaskDialogOpen, setMetaMaskDialogOpen] = useState(false);

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

        <button onClick={handleConnectWallet} id="connect-wallet-button" className="bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 glow-blue-hover transform hover:scale-105 flex items-center space-x-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
            <span>{walletContext?.address ? `${walletContext.address.substring(0, 6)}...${walletContext.address.substring(walletContext.address.length - 4)}` : "Connect Wallet"}</span>
        </button>
        <MetaMaskDialog isOpen={isMetaMaskDialogOpen} onClose={() => setMetaMaskDialogOpen(false)} />
    </header>
  );
};

export default Header;
