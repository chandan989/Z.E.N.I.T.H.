// Z.E.I.N.T.H. Exchange/src/pages/Portfolio.jsx
import React from 'react';

// Mock data for user's portfolio
const portfolioAssets = [
    { name: 'lucknowcrafts.com', ticker: '$LKC', amount: 15.5, value: 193750.00 },
    { name: 'Orion-AI-10', ticker: '$OAI10', amount: 120.0, value: 18090.00 },
    { name: 'mumbaifoodie.com', ticker: '$MFC', amount: 5.0, value: 125000.00 },
];

const Portfolio = () => {
    const totalValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0);

    return (
        <div className="p-4 h-full">
            <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
            <div className="mb-8">
                <p className="text-stardust-grey">Total Value</p>
                <p className="text-5xl font-bold text-bright-white font-fira-code">${totalValue.toLocaleString()}</p>
            </div>

            <div className="bg-dark-matter/30 backdrop-blur-xl border border-stardust-grey/10 rounded-lg p-6">
                <table className="w-full text-left">
                    <thead>
                    <tr className="border-b border-stardust-grey/20">
                        <th className="p-4 text-sm text-stardust-grey font-bold uppercase">Asset</th>
                        <th className="p-4 text-sm text-stardust-grey font-bold uppercase text-right">Amount</th>
                        <th className="p-4 text-sm text-stardust-grey font-bold uppercase text-right">Value (USD)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {portfolioAssets.map(asset => (
                        <tr key={asset.ticker} className="border-b border-stardust-grey/10 last:border-b-0">
                            <td className="p-4">
                                <p className="font-bold text-bright-white">{asset.name}</p>
                                <p className="text-stardust-grey">{asset.ticker}</p>
                            </td>
                            <td className="p-4 text-right font-fira-code">{asset.amount.toFixed(4)}</td>
                            <td className="p-4 text-right font-fira-code text-bright-white">${asset.value.toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Portfolio;