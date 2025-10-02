import React, { useState, useEffect } from 'react';

interface MarketData {
  zvi: number;
  tvo: number;
  volume: number;
}

const Footer = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    zvi: 42.15,
    tvo: 1294833.10,
    volume: 271402.55,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => ({
        zvi: Math.max(10, Math.min(90, prevData.zvi + (Math.random() - 0.5) * 0.1)),
        tvo: prevData.tvo + Math.random() * 50,
        volume: prevData.volume + (Math.random() - 0.4) * 100,
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <footer className="w-full p-6 md:p-8 flex-shrink-0">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-4">
        <div className="w-full backdrop-blur-sm bg-black/20 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-around text-center">
          <div className="p-2 w-full md:w-1/3">
            <p className="text-xs text-stardust-grey uppercase tracking-widest">ZVI (Zenith Volatility Index)</p>
            <p className="text-2xl md:text-3xl text-white font-data font-bold mt-1">{marketData.zvi.toFixed(2)}</p>
          </div>
          <div className="h-8 w-px bg-gray-700 hidden md:block"></div>
          <div className="w-full h-px bg-gray-700 md:hidden my-2"></div>
          <div className="p-2 w-full md:w-1/3">
            <p className="text-xs text-stardust-grey uppercase tracking-widest">TVO (Total Value Onboarded)</p>
            <p className="text-2xl md:text-3xl text-white font-data font-bold mt-1">{formatCurrency(marketData.tvo)}</p>
          </div>
          <div className="h-8 w-px bg-gray-700 hidden md:block"></div>
          <div className="w-full h-px bg-gray-700 md:hidden my-2"></div>
          <div className="p-2 w-full md:w-1/3">
            <p className="text-xs text-stardust-grey uppercase tracking-widest">24h Volume</p>
            <p className="text-2xl md:text-3xl text-white font-data font-bold mt-1">{formatCurrency(marketData.volume)}</p>
          </div>
        </div>
        <a href="https://doma.xyz/" target="_blank" rel="noopener noreferrer" className="text-xs text-stardust-grey hover:text-white transition-colors duration-300">
          Powered by <span className="font-bold">Doma Protocol</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
