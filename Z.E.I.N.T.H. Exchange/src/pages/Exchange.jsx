// Z.E.I.N.T.H. Exchange/src/pages/Exchange.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AssetNavigator from '../components/AssetNavigator';
import Skychart from '../components/Skychart';
import CommandModule from '../components/CommandModule';
import OrderBook from '../components/OrderBook';
import { assets, constellations } from '../data/mockData';

const Exchange = () => {
    const [selectedAsset, setSelectedAsset] = useState(assets[0]);

    const handleSelectAsset = (asset) => {
        const allAssets = [...assets, ...constellations];
        const fullAsset = allAssets.find(a => a.ticker === asset.ticker) || asset;
        setSelectedAsset(fullAsset);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="app-grid">
            <motion.div style={{ gridArea: 'nav' }} variants={containerVariants} initial="hidden" animate="visible">
                <AssetNavigator
                    assets={assets}
                    constellations={constellations}
                    onSelectAsset={handleSelectAsset}
                    selectedAssetTicker={selectedAsset.ticker}
                />
            </motion.div>

            <motion.div style={{ gridArea: 'main' }} variants={containerVariants} initial="hidden" animate="visible">
                <Skychart asset={selectedAsset} />
            </motion.div>

            <motion.footer
                style={{ gridArea: 'footer' }}
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <OrderBook />
                <CommandModule asset={selectedAsset} />
            </motion.footer>
        </div>
    );
};

export default Exchange;