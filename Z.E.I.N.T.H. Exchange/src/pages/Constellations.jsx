// Z.E.I.N.T.H. Exchange/src/pages/Constellations.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { constellations } from '../data/mockData';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const ConstellationCard = ({ constellation, index }) => {
    const isPositive = constellation.change.startsWith('+');
    return (
        <motion.div
            className="bg-dark-matter/30 backdrop-blur-xl border border-stardust-grey/10 rounded-lg p-6 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-bright-white">{constellation.name}</h2>
                    <p className="text-sm text-stardust-grey">{constellation.description}</p>
                </div>
                <div className="text-right font-fira-code">
                    <p className="text-xl text-bright-white">{constellation.price}</p>
                    <p className={isPositive ? 'text-supernova-green' : 'text-red-giant'}>{constellation.change}</p>
                </div>
            </div>
            <div className="flex-grow w-full h-24 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={constellation.history}>
                        <defs>
                            <linearGradient id={`grad-${constellation.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#38BDF8" strokeWidth={2} fill={`url(#grad-${constellation.id})`} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <button className="mt-6 bg-celestial-blue/10 text-celestial-blue font-bold py-2 px-4 rounded-lg hover:bg-celestial-blue/20 transition-colors">
                View Details
            </button>
        </motion.div>
    );
};

const Constellations = () => {
    return (
        <div className="p-4 h-full">
            <h1 className="text-3xl font-bold text-white mb-6">Constellations</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {constellations.map((c, index) => (
                    <ConstellationCard key={c.id} constellation={c} index={index} />
                ))}
            </div>
        </div>
    );
};

export default Constellations;