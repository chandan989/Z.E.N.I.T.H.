import React from 'react';
import Layout from '../components/Layout';
import { constellations } from '../data/mockData';

const Dashboard = ({ onNavigate }) => {
    const summaryData = {
        totalDomains: constellations.flatMap(c => c.assets).length,
        totalValue: constellations.flatMap(c => c.assets).reduce((sum, asset) => sum + asset.marketCap, 0),
        dailyChange: 2.3, // Placeholder
    };

    const allDomains = constellations.flatMap(c => c.assets);
    const topPerformer = allDomains.reduce((prev, current) => (prev.domaScore > current.domaScore) ? prev : current);
    const newlyAdded = allDomains[allDomains.length - 1];

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    return (
        <Layout onNavigate={onNavigate}>
            <main className="flex-grow flex flex-col items-center px-4 py-12">
                <div className="w-full max-w-7xl mx-auto space-y-12">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white">Stellar Report</h1>
                        <p className="text-stardust-grey mt-2">Your central hub for market data, insights, and discovery.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-dark-matter border border-gray-800 rounded-xl p-6">
                            <p className="text-sm text-stardust-grey uppercase tracking-widest">Total Domains</p>
                            <p className="text-4xl font-bold text-white font-data mt-2">{summaryData.totalDomains}</p>
                        </div>
                        <div className="bg-dark-matter border border-gray-800 rounded-xl p-6">
                            <p className="text-sm text-stardust-grey uppercase tracking-widest">Total Market Value</p>
                            <p className="text-4xl font-bold text-white font-data mt-2">{formatCurrency(summaryData.totalValue)}</p>
                        </div>
                        <div className="bg-dark-matter border border-gray-800 rounded-xl p-6">
                            <p className="text-sm text-stardust-grey uppercase tracking-widest">24h Change</p>
                            <p className={`text-4xl font-bold font-data mt-2 ${summaryData.dailyChange > 0 ? 'text-supernova-green' : 'text-red-giant'}`}>
                                {summaryData.dailyChange > 0 ? '+' : ''}{summaryData.dailyChange}%
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-dark-matter border border-gray-800 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">AI Insights</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="text-supernova-green">{/* Icon */}
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    </div>
                                    <p><span className="font-bold">Trending Up:</span> The 'DeFi Pulse' constellation is showing strong positive momentum. Consider exploring its underlying assets like <span className="font-data">uniswap.org</span>.</p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="text-celestial-blue">{/* Icon */}
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p><span className="font-bold">High Potential:</span> <span className="font-data">blur.io</span> has a high Doma Score but its market cap is relatively low compared to peers. This could indicate a growth opportunity.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="bg-dark-matter border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-celestial-blue" onClick={() => onNavigate('report', topPerformer)}>
                                <h2 className="text-xl font-bold text-white mb-2">Top Performer</h2>
                                <span className="text-lg font-data text-celestial-blue">{topPerformer.domain}</span>
                                <p className="text-lg font-bold text-white mt-1">Doma Score: {topPerformer.domaScore}</p>
                            </div>
                            <div className="bg-dark-matter border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-celestial-blue" onClick={() => onNavigate('report', newlyAdded)}>
                                <h2 className="text-xl font-bold text-white mb-2">Newly Added</h2>
                                <span className="text-lg font-data text-celestial-blue">{newlyAdded.domain}</span>
                                <p className="text-lg font-bold text-white mt-1">Doma Score: {newlyAdded.domaScore}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <h2 className="text-3xl font-bold text-white">Constellations</h2>
                            <div className="relative group">
                                <svg className="w-5 h-5 text-stardust-grey cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div className="absolute bottom-full mb-2 w-64 bg-void-black border border-gray-700 text-stardust-grey text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    Constellations are AI-curated indices of domain NFTs, allowing for thematic and intelligent trading.
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {constellations.map(c => (
                                <div key={c.id} className="bg-dark-matter border border-gray-800 rounded-xl p-6 hover:border-celestial-blue transition-colors cursor-pointer" onClick={() => onNavigate('constellationDetail', c)}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-white">{c.name}</h3>
                                        <div className={`text-md font-data ${c.performance > 0 ? 'text-supernova-green' : 'text-red-giant'}`}>
                                            {c.performance > 0 ? '+' : ''}{c.performance.toFixed(1)}%
                                        </div>
                                    </div>
                                    <p className="text-sm text-stardust-grey">{c.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

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
                                            <td className="p-4 font-bold text-white font-data">{domain.domain}</td>
                                            <td className="p-4 font-data text-celestial-blue">{domain.domaScore}</td>
                                            <td className="p-4 font-data">{formatCurrency(domain.marketCap)}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => onNavigate('report', domain)} className="bg-celestial-blue/20 text-celestial-blue text-xs font-bold py-1 px-3 rounded-md hover:bg-celestial-blue/40">View Report</button>
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
