// Z.E.I.N.T.H. Exchange/src/pages/Exchange.jsx

import React, { useState, useEffect } from 'react';
import AssetNavigator from '../components/AssetNavigator';
import Skychart from '../components/Skychart';
import CommandModule from '../components/CommandModule';
import { assets, constellations } from '../data/mockData';
import './Exchange.css'; // <-- Import the new CSS

const Exchange = () => {
    const [selectedAsset, setSelectedAsset] = useState(assets[0]);

    // Mouse tracking for stellar panel glow effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            document.querySelectorAll('.stellar-panel').forEach(panel => {
                const rect = panel.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                panel.style.setProperty('--x', `${x}px`);
                panel.style.setProperty('--y', `${y}px`);
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);


    const handleSelectAsset = (asset) => {
        // Find the full asset object from mockData to ensure we have history
        const allAssets = [...assets, ...constellations];
        const fullAsset = allAssets.find(a => a.ticker === asset.ticker) || asset;
        setSelectedAsset(fullAsset);
    };

    return (
        <div className="flex h-full p-4 space-x-4 text-stardust-grey font-inter">
            <div className="w-1/4 h-full">
                <AssetNavigator
                    assets={assets}
                    constellations={constellations}
                    onSelectAsset={handleSelectAsset}
                    selectedAssetTicker={selectedAsset.ticker}
                />
            </div>
            <div className="flex flex-col w-1/2 h-full space-y-4">
                <Skychart asset={selectedAsset} />
                {/* You can add more panels here if needed */}
            </div>
            <div className="w-1/4 h-full">
                <CommandModule asset={selectedAsset} />
            </div>
        </div>
    );
};

export default Exchange;