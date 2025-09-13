// Z.E.I.N.T.H. Exchange/src/components/CommandModule.jsx
import React, { useState } from 'react';

const CommandModule = ({ asset }) => {
    const [orderType, setOrderType] = useState('buy');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const total = (parseFloat(price) || 0) * (parseFloat(amount) || 0);

    const InputField = ({ label, value, onChange, placeholder }) => (
        <div>
            <label className="block text-sm text-stardust-grey/80 mb-1.5">{label}</label>
            <div className="relative flex items-center bg-dark-matter border border-stardust-grey/20 rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-celestial-blue/50">
                <input
                    type="number"
                    className="w-full h-11 bg-transparent text-white placeholder-stardust-grey/50 px-3 font-fira-code text-base outline-none rounded-lg"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );

    return (
        <div className="bg-dark-matter/30 backdrop-blur-xl border border-stardust-grey/10 p-4 rounded-lg h-full flex flex-col">
            {/* ... (no changes to toggles and inputs) ... */}

            {/* Action Button */}
            <div className="mt-auto pt-6">
                <button
                    className="w-full font-bold py-3 rounded-lg text-void-black transition-all duration-300 transform hover:scale-105 bg-celestial-blue"
                >
                    Place {orderType.toUpperCase()} Order
                </button>
            </div>
        </div>
    );
};

export default CommandModule;