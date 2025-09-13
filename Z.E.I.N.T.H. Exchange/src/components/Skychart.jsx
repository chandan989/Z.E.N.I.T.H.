// Z.E.I.N.T.H. Exchange/src/components/Skychart.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    // ... (no changes)
};

const Skychart = ({ asset }) => {
    const isPositive = asset.change.startsWith('+');
    return (
        <div className="bg-dark-matter/30 backdrop-blur-xl border border-stardust-grey/10 p-4 rounded-lg h-full flex flex-col">
            {/* ... Header section (no changes) ... */}
            <div className="flex-grow w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={asset.history} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#A1A1AA" tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                        <YAxis stroke="#A1A1AA" tick={{ fill: '#A1A1AA', fontSize: 12 }} domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#38BDF8', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                        <Area type="monotone" dataKey="value" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#chartGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Skychart;