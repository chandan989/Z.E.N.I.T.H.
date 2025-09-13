// Z.E.I.N.T.H. Exchange/src/pages/Dashboard.jsx
import React from 'react';
import Layout from '../components/Layout';
import { assets, constellations } from '../data/mockData'; // Using existing mock data

const Dashboard = ({ onNavigate }) => {
    // Corrected flatMap to handle constellations that might not have an assets array.
    const allDomains = [...assets, ...constellations.flatMap(c => c.assets || [])];

    const summaryData = {
        totalDomains: allDomains.length,
        totalValue: allDomains.reduce((sum, asset) => sum + (asset.marketCap || 0), 0),
        dailyChange: 1.7, // Placeholder
    };

    const topPerformer = allDomains.length > 0 ? allDomains.reduce((prev, current) => ((prev.domaScore || 0) > (current.domaScore || 0)) ? prev : current) : null;
    const newlyAdded = allDomains.length > 0 ? allDomains[allDomains.length - 1] : null;

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    return (
        <Layout onNavigate={onNavigate}>
            <main className="flex-grow flex flex-col items-center px-4 py-12">
                <div className="w-full max-w-7xl mx-auto space-y-12">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white">Domain NFT Exchange</h1>
                        <p className="text-stardust-grey mt-2">The central marketplace for digital real estate.</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-dark-matter border border-gray-800 rounded-xl p-6">
                            <p className="text-sm text-stardust-grey uppercase tracking-widest">Total Domains Listed</p>
                            <p className="text-4xl font-bold text-white font-data mt-2">{summaryData.totalDomains}</p>
                        </div>
                        <div className="bg-dark-matter border border-gray-800 rounded-xl p-6">
                            <p className="text-sm text-stardust-grey uppercase tracking-widest">Total Market Value</p>
                            <p className="text-4xl font-bold text-white font-data mt-2">{formatCurrency(summaryData.totalValue)}</p>
                        </div>
                        <div className="bg-dark-matter border border-gray-800 rounded-xl p-6">
                            <p className="text-sm text-stardust-grey uppercase tracking-widest">24h Volume</p>
                            <p className="text-4xl font-bold text-white font-data mt-2">$271,402.55</p> {/* Placeholder */}
                        </div>
                    </div>

                    {/* AI Insights & Top Performers */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-dark-matter border border-gray-800 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">AI Recommendations</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="text-supernova-green">{/* Icon */}
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    </div>
                                    <p><span className="font-bold">Trending Up:</span> The domain <span className="font-data">web3.eth</span> is showing strong buying signals based on recent market activity.</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="text-celestial-blue">{/* Icon */}
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p><span className="font-bold">High Potential:</span> <span className="font-data">blur.io</span> has a high Doma Score but is currently undervalued compared to similar assets.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {topPerformer && (
                                <div className="bg-dark-matter border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-celestial-blue" onClick={() => onNavigate('exchange', topPerformer)}>
                                    <h2 className="text-xl font-bold text-white mb-2">Top Performer</h2>
                                    <span className="text-lg font-data text-celestial-blue">{topPerformer.domain || topPerformer.ticker}</span>
                                    <p className="text-lg font-bold text-white mt-1">Doma Score: {topPerformer.domaScore}</p>
                                </div>
                            )}
                            {newlyAdded && (
                                <div className="bg-dark-matter border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-celestial-blue" onClick={() => onNavigate('exchange', newlyAdded)}>
                                    <h2 className="text-xl font-bold text-white mb-2">Newly Added</h2>
                                    <span className="text-lg font-data text-celestial-blue">{newlyAdded.domain || newlyAdded.ticker}</span>
                                    <p className="text-lg font-bold text-white mt-1">Doma Score: {newlyAdded.domaScore}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* All Domain NFTs Table */}
                    <div className="bg-dark-matter border border-gray-800 rounded-xl">
                        <h2 className="text-3xl font-bold text-white mb-6 p-6">All Domain NFTs</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="p-4 text-sm uppercase text-stardust-grey tracking-wider">Domain</th>
                                        <th className="p-4 text-sm uppercase text-stardust-grey tracking-wider">Doma Score</th>
                                        <th className="p-4 text-sm uppercase text-stardust-grey tracking-wider">Market Cap</th>
                                        <th className="p-4 text-sm uppercase text-stardust-grey tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allDomains.map(domain => (
                                        <tr key={domain.id} className="border-b border-gray-800">
                                            <td className="p-4 font-bold text-white font-data">{domain.domain || domain.ticker}</td>
                                            <td className="p-4 font-data text-celestial-blue">{domain.domaScore}</td>
                                            <td className="p-4 font-data">{formatCurrency(domain.marketCap || 0)}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => onNavigate('exchange', domain)} className="bg-celestial-blue/20 text-celestial-blue text-xs font-bold py-1 px-3 rounded-md hover:bg-celestial-blue/40">Trade</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Dashboard;
