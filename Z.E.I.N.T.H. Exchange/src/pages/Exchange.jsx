// Z.E.I.N.T.H. Exchange/src/pages/Exchange.jsx
import React from 'react';
import './Exchange.css'; // Import the floating panel styles
import Layout from '../components/Layout';
import Skychart from '../components/Skychart';
import CommandModule from '../components/CommandModule';
import OrderBook from '../components/OrderBook';

const Exchange = ({ asset, onNavigate }) => {

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    return (
        <Layout onNavigate={onNavigate}>
            <main className="flex-grow w-full px-4 pb-4">
                <div className="constellation-view">

                    {/* Fullscreen Background Chart */}
                    <div className="constellation-skychart">
                        <Skychart asset={asset} />
                    </div>

                    {/* Floating Header for Asset Info */}
                    <header className="constellation-header">
                        <div className="floating-header-bar flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white font-data">{asset.domain || asset.ticker}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-stardust-grey uppercase tracking-widest">Doma Score</p>
                                <p className="text-xl font-bold text-celestial-blue font-data mt-1">{asset.domaScore}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-stardust-grey uppercase tracking-widest">Market Cap</p>
                                <p className="text-xl font-bold text-white font-data mt-1">{formatCurrency(asset.marketCap || 0)}</p>
                            </div>
                        </div>
                    </header>

                    {/* Floating Left Panel for Order Book */}
                    <aside className="constellation-left-panel">
                        <div className="floating-panel">
                            <OrderBook />
                        </div>
                    </aside>

                    {/* Floating Right Panel for Command Module */}
                    <aside className="constellation-right-panel">
                        <div className="floating-panel">
                            <CommandModule asset={asset} />
                        </div>
                    </aside>

                </div>
            </main>
        </Layout>
    );
};

export default Exchange;
