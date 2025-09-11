import React, { useState, useEffect } from 'react';
import './StellarReport.css';
import Skychart from './Skychart';
import Layout from '../components/Layout';

const Astrolabe = ({ score = 750, size = "normal" }) => {
  const isSmall = size === "small";
  const containerSize = isSmall ? "w-24 h-24" : "w-56 h-56";

  const radius = isSmall ? 42 : 100;
  const strokeWidth = isSmall ? 6 : 12;
  const circumference = 2 * Math.PI * radius;
  const percentage = score / 1000;

  const [strokeDashoffset, setStrokeDashoffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStrokeDashoffset(circumference - percentage * circumference);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, percentage, circumference]);

  const svgSize = isSmall ? 96 : 224;
  const viewBoxSize = isSmall ? 96 : 224;

  return (
    <div className={`relative ${containerSize} flex items-center justify-center`}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="absolute transform -rotate-90"
      >
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          stroke="#27272a"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          stroke="url(#astrolabe-gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
            <linearGradient id="astrolabe-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
        </defs>
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center text-white">
        <span className={`${isSmall ? 'text-2xl font-bold' : 'text-5xl font-bold'} leading-none font-data`}>{score}</span>
         { !isSmall && <span className="text-xs uppercase tracking-widest text-stardust-grey mt-1">Doma Score</span> }
      </div>
    </div>
  );
};

const SentimentNebula = () => {
    const [nebulaStyle, setNebulaStyle] = useState({});
    const [sentimentText, setSentimentText] = useState("Neutral");

    useEffect(() => {
        const interval = setInterval(() => {
            const sentiment = Math.random();
            let color, text;
            if (sentiment < 0.33) {
                color = '#DC2626'; text = 'Negative';
            } else if (sentiment < 0.66) {
                color = '#A1A1AA'; text = 'Neutral';
            } else {
                color = '#22C55E'; text = 'Positive';
            }
            setSentimentText(text);
            setNebulaStyle({
                background: `radial-gradient(ellipse at center, ${color}33 0%, transparent 70%)`,
                boxShadow: `0 0 60px 30px ${color}22, inset 0 0 30px 15px ${color}11`,
                transform: `scale(${0.95 + Math.random() * 0.1}) rotate(${Math.random() * 10 - 5}deg)`,
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative bg-dark-matter border border-gray-800 rounded-xl overflow-hidden h-full flex items-center justify-center p-6">
            <div
                className="absolute w-full h-full rounded-full transition-all duration-1000 ease-in-out"
                style={nebulaStyle}
            ></div>
            <div className="z-10 text-center">
                 <p className="text-sm uppercase text-stardust-grey tracking-widest">Social Sentiment</p>
                 <p className="text-white font-bold text-2xl mt-1">{sentimentText}</p>
            </div>
        </div>
    );
};

const StellarReport = ({ onNavigate, asset: initialAsset }) => {
    const [asset, setAsset] = useState(initialAsset);

    useEffect(() => {
        if (!initialAsset) return;

        setAsset(initialAsset);

        const interval = setInterval(() => {
            setAsset(prevAsset => ({
                ...prevAsset,
                domaScore: Math.max(700, Math.min(950, prevAsset.domaScore + Math.floor(Math.random() * 7) - 3)),
                marketCap: prevAsset.marketCap + (Math.random() - 0.48) * 5000,
                volume24h: prevAsset.volume24h + (Math.random() - 0.4) * 2000,
                seoScore: Math.max(80, Math.min(99, prevAsset.seoScore + (Math.random() > 0.5 ? 1 : -1))),
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, [initialAsset]);

    if (!asset) {
        return (
            <Layout onNavigate={onNavigate}>
                <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white">No Asset Selected</h1>
                        <p className="text-stardust-grey mt-2">Please return to the dashboard to select a domain NFT.</p>
                        <button onClick={() => onNavigate('dashboard')} className="mt-6 bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg">
                            Go to Dashboard
                        </button>
                    </div>
                </main>
            </Layout>
        );
    }

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    const formatTraffic = (value) => `${(value / 1000000).toFixed(2)}M/mo`;

    return (
        <Layout onNavigate={onNavigate}>
            <main className="flex-grow flex flex-col items-center px-4 py-12">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">{asset.domain}</h1>
                        <p className="text-2xl font-data text-celestial-blue mt-1">${asset.ticker}</p>
                    </div>

                    <div className="space-y-8">
                        <Skychart />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="bg-dark-matter border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center">
                                <Astrolabe score={asset.domaScore} size="normal" />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-dark-matter border border-gray-800 rounded-xl p-5">
                                    <p className="text-xs text-stardust-grey uppercase tracking-widest">Market Cap</p>
                                    <p className="text-2xl text-white font-data font-bold mt-1">{formatCurrency(asset.marketCap)}</p>
                                </div>
                                <div className="bg-dark-matter border border-gray-800 rounded-xl p-5">
                                    <p className="text-xs text-stardust-grey uppercase tracking-widest">24h Volume</p>
                                    <p className="text-2xl text-white font-data font-bold mt-1">{formatCurrency(asset.volume24h)}</p>
                                </div>
                                <div className="bg-dark-matter border border-gray-800 rounded-xl p-5">
                                    <p className="text-xs text-stardust-grey uppercase tracking-widest">Live SEO Score</p>
                                    <p className="text-2xl text-white font-data font-bold mt-1">{asset.seoScore}</p>
                                </div>
                                <div className="bg-dark-matter border border-gray-800 rounded-xl p-5">
                                    <p className="text-xs text-stardust-grey uppercase tracking-widest">Traffic Estimate</p>
                                    <p className="text-2xl text-white font-data font-bold mt-1">{formatTraffic(asset.trafficEstimate)}</p>
                                </div>
                            </div>

                            <SentimentNebula />
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default StellarReport;
