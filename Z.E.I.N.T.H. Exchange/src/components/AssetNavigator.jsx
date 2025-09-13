// Z.E.I.N.T.H. Exchange/src/components/AssetNavigator.jsx
import React, { useState } from 'react';
import Icon from './Icon';

const AssetNavigator = ({ assets, constellations, onSelectAsset, selectedAssetTicker }) => {
    const [activeTab, setActiveTab] = useState('All Assets');
    const [searchTerm, setSearchTerm] = useState('');

    const filterItems = (items) =>
        items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.ticker.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const renderAsset = (asset) => {
        const isSelected = selectedAssetTicker === asset.ticker;
        const isPositive = asset.change.startsWith('+');
        return (
            <li
                key={asset.ticker}
                className={`flex justify-between items-center p-3 my-1 rounded-md cursor-pointer transition-all duration-200 ${
                    isSelected ? 'bg-cosmic-teal/10' : 'hover:bg-dark-matter/50'
                }`}
                onClick={() => onSelectAsset(asset)}
            >
                <div className="flex items-center">
                    <div className={`w-1 h-8 rounded-full mr-3 ${isSelected ? 'bg-cosmic-teal' : 'bg-transparent'}`}></div>
                    <div>
                        <p className="font-bold text-bright-white">{asset.ticker}</p>
                        <p className="text-sm text-stardust-grey truncate w-32">{asset.name}</p>
                    </div>
                </div>
                <div className="text-right font-fira-code">
                    <p className="text-bright-white">{asset.price.replace(' USD', '')}</p>
                    <p className={`text-sm ${isPositive ? 'text-supernova-green' : 'text-red-giant'}`}>{asset.change}</p>
                </div>
            </li>
        );
    };

    return (
        <div className="bg-dark-matter p-4 rounded-lg h-full flex flex-col stellar-panel">
            {/* Search Input */}
            <div className="relative mb-4">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stardust-grey/50" />
                <input
                    type="text"
                    placeholder="Search Assets..."
                    className="w-full bg-void-black border border-stardust-grey/20 rounded-lg pl-10 pr-4 py-2 text-stardust-grey focus:outline-none focus:ring-2 focus:ring-cosmic-teal/50"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tabs */}
            <div className="flex mb-2 border-b border-stardust-grey/20">
                <button
                    className={`px-4 py-2 text-sm transition-colors ${activeTab === 'All Assets' ? 'text-cosmic-teal border-b-2 border-cosmic-teal' : 'text-stardust-grey hover:text-bright-white'}`}
                    onClick={() => setActiveTab('All Assets')}
                >
                    All Assets
                </button>
                <button
                    className={`px-4 py-2 text-sm transition-colors ${activeTab === 'Constellations' ? 'text-cosmic-teal border-b-2 border-cosmic-teal' : 'text-stardust-grey hover:text-bright-white'}`}
                    onClick={() => setActiveTab('Constellations')}
                >
                    Constellations
                </button>
            </div>

            {/* Asset List */}
            <div className="flex-grow overflow-y-auto pr-1">
                {activeTab === 'All Assets' && <ul>{filterItems(assets).map(renderAsset)}</ul>}
                {activeTab === 'Constellations' && <ul>{filterItems(constellations).map(renderAsset)}</ul>}
            </div>
        </div>
    );
};

export default AssetNavigator;