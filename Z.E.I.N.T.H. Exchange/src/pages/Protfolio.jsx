import React from 'react';
import Layout from '../components/Layout';
import { portfolio } from '../data/mockData';

const Portfolio = () => {
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    return (
        <Layout>
            <main className="flex-grow flex flex-col items-center px-4 py-12">
                <div className="w-full max-w-4xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white">Your Portfolio</h1>
                            <p className="text-stardust-grey mt-1">Manage your digital real estate assets.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-stardust-grey text-sm">Total Value</p>
                            <p className="text-3xl font-bold text-white font-data">{formatCurrency(portfolio.totalValue)}</p>
                        </div>
                    </div>

                    <div className="bg-dark-matter border border-gray-800 rounded-xl">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-800">
                            <tr>
                                <th className="p-4 text-xs uppercase text-stardust-grey">Asset</th>
                                <th className="p-4 text-xs uppercase text-stardust-grey">Holdings</th>
                                <th className="p-4 text-xs uppercase text-stardust-grey text-right">Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {portfolio.holdings.map(({ asset, amount, value }) => (
                                <tr key={asset.id} className="border-b border-gray-800 last:border-b-0">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{asset.ticker}</div>
                                        <div className="text-xs text-stardust-grey">{asset.domain}</div>
                                    </td>
                                    <td className="p-4 font-data text-white">{amount.toFixed(4)}</td>
                                    <td className="p-4 font-data text-white text-right">{formatCurrency(value)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Portfolio;