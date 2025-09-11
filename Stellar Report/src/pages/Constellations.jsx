import React from 'react';
import Layout from '../components/Layout';
import { constellations } from '../data/mockData';

const Constellations = ({ onNavigate }) => {
    return (
        <Layout onNavigate={onNavigate}>
            <main className="flex-grow flex flex-col items-center px-4 py-12">
                <div className="text-center w-full max-w-4xl">
                    <h1 className="text-5xl font-bold text-white">Constellations</h1>
                    <p className="text-stardust-grey mt-2">AI-curated indices for thematic, intelligent trading.</p>
                </div>

                <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                    {constellations.map(c => (
                        <div key={c.id} className="bg-dark-matter border border-gray-800 rounded-xl p-6 hover:border-celestial-blue transition-colors cursor-pointer" onClick={() => onNavigate('constellationDetail', c)}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">{c.name}</h2>
                                <div className={`text-lg font-data ${c.performance > 0 ? 'text-supernova-green' : 'text-red-giant'}`}>
                                    {c.performance > 0 ? '+' : ''}{c.performance.toFixed(1)}%
                                </div>
                            </div>
                            <p className="text-stardust-grey mb-6">{c.description}</p>
                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-stardust-grey mb-2">Top Assets</h3>
                                <div className="space-y-2">
                                    {c.assets.slice(0, 3).map(asset => (
                                        <div key={asset.id} className="flex justify-between items-center bg-void-black p-2 rounded-lg">
                                            <span className="font-bold text-white">{asset.ticker}</span>
                                            <span className="text-xs text-stardust-grey">{asset.domain}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </Layout>
    );
};

export default Constellations;
