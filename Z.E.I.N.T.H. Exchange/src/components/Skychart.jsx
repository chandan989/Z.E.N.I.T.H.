// Z.E.I.N.T.H. Exchange/src/components/Skychart.jsx

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-matter/80 backdrop-blur-sm p-2 border border-stardust-grey/20 rounded-md shadow-lg">
                <p className="label text-bright-white">{`${label}`}</p>
                <p className="intro text-cosmic-teal">{`Value : ${payload[0].value.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
};


const Skychart = ({ asset }) => {
    const isPositive = asset.change.startsWith('+');

    return (
        <div className="bg-dark-matter p-4 rounded-lg h-full flex flex-col stellar-panel">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-bright-white">{asset.name} ({asset.ticker})</h2>
                    <p className="text-sm text-stardust-grey">{asset.description || 'Individual Asset'}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-fira-code text-bright-white">{asset.price}</p>
                    <p className={`font-fira-code ${isPositive ? 'text-supernova-green' : 'text-red-giant'}`}>
                        {asset.change} ({asset.changeValue.toFixed(2)} USD)
                    </p>
                </div>
            </div>
            {/* Chart */}
            <div className="flex-grow w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={asset.history} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#A1A1AA" tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                        <YAxis stroke="#A1A1AA" tick={{ fill: '#A1A1AA', fontSize: 12 }} domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FBBF24', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                        <Area type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Skychart;