import React from 'react';
import Layout from '../components/Layout';
import AssetNavigator from '../components/AssetNavigator';
import Skychart from '../components/Skychart';
import CommandModule from '../components/CommandModule';
import {assets, constellations} from "../data/mockData";

const Exchange = () => {
    const selectedAsset = assets[0];

    return (
        <Layout>
            <main className="flex-grow grid grid-cols-12 h-[calc(100vh-160px)]">
                <div className="col-span-3 h-full">
                    <AssetNavigator assets={assets} constellations={constellations} />
                </div>
                <div className="col-span-6 h-full skychart-grid">
                    <Skychart asset={selectedAsset} />
                </div>
                <div className="col-span-3 h-full">
                    <CommandModule asset={selectedAsset} />
                </div>
            </main>
        </Layout>
    );
};

export default Exchange;