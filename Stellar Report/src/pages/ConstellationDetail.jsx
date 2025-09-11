import React from 'react';
import Layout from '../components/Layout';

const ConstellationDetail = ({ onNavigate, constellation }) => {

    if (!constellation) {
        return (
            <Layout onNavigate={onNavigate}>
                <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white">No Constellation Selected</h1>
                        <p className="text-stardust-grey mt-2">Please return to the constellations page to select one.</p>
                        <button onClick={() => onNavigate('constellations')} className="mt-6 bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg">
                            Back to Constellations
                        </button>
                    </div>
                </main>
            </Layout>
        );
    }

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    return (
        <Layout onNavigate={onNavigate}>
            <main className="flex-grow flex flex-col items-center px-4 py-12">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-white">{constellation.name}</h1>
                        <p className="text-stardust-grey mt-2 max-w-2xl mx-auto">{constellation.description}</p>
                        <div className={`text-2xl font-data mt-4 ${constellation.performance > 0 ? 'text-supernova-green' : 'text-red-giant'}`}>
                            24h Performance: {constellation.performance > 0 ? '+' : ''}{constellation.performance.toFixed(1)}%
                        </div>
                    </div>

                    <div className="bg-dark-matter border border-gray-800 rounded-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 p-6">Domains in this Constellation</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="p-4 text-sm uppercase text-stardust-grey tracking-wider">Domain</th>
                                    <th className="p-4 text-sm uppercase text-stardust-grey tracking-wider">Doma Score</th>
                                    <th className="p-4 text-sm uppercase text-stardust-grey tracking-wider">Market Cap</th>
                                    <th className="p-4 text-sm uppercase text-stardust-grey tracking-wider">24h Volume</th>
                                </tr>
                            </thead>
                            <tbody>
                                {constellation.assets.map(domain => (
                                    <tr key={domain.id} className="border-b border-gray-800 hover:bg-void-black cursor-pointer" onClick={() => onNavigate('report', domain)}>
                                        <td className="p-4 font-bold text-white font-data">{domain.domain}</td>
                                        <td className="p-4 font-data text-celestial-blue">{domain.domaScore}</td>
                                        <td className="p-4 font-data">{formatCurrency(domain.marketCap)}</td>
                                        <td className="p-4 font-data">{formatCurrency(domain.volume24h)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     <div className="text-center mt-8">
                        <button onClick={() => onNavigate('constellations')} className="bg-celestial-blue text-void-black font-bold py-2 px-5 rounded-lg">
                            Back to All Constellations
                        </button>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default ConstellationDetail;
