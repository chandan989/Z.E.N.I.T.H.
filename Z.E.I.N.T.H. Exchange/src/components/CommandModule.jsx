// Z.E.I.N.T.H. Exchange/src/components/CommandModule.jsx
import React, { useState } from 'react';

const CommandModule = ({ asset }) => {
    const [orderType, setOrderType] = useState('buy');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const total = (parseFloat(price) || 0) * (parseFloat(amount) || 0);

    const handlePlaceOrder = () => {
        console.log({ asset: asset.ticker, orderType, price, amount, total });
        // Add actual order placement logic here
    };

    const InputField = ({ label, value, onChange, placeholder }) => (
        <div>
            <label className="block text-sm text-stardust-grey/80 mb-1.5">{label}</label>
            <input
                type="number"
                className="w-full bg-void-black border border-stardust-grey/20 rounded-lg px-3 py-2 text-bright-white font-fira-code focus:outline-none focus:ring-2 focus:ring-cosmic-teal/50 transition-all"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="bg-dark-matter p-4 rounded-lg h-full flex flex-col stellar-panel">
            <h2 className="text-lg font-bold text-bright-white mb-4">Command Module</h2>

            {/* Buy/Sell Toggles */}
            <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-void-black rounded-lg">
                <button
                    onClick={() => setOrderType('buy')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                        orderType === 'buy'
                            ? 'bg-supernova-green/20 text-supernova-green shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                            : 'text-stardust-grey hover:bg-stardust-grey/5'
                    }`}
                >
                    BUY
                </button>
                <button
                    onClick={() => setOrderType('sell')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                        orderType === 'sell'
                            ? 'bg-red-giant/20 text-red-giant shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                            : 'text-stardust-grey hover:bg-stardust-grey/5'
                    }`}
                >
                    SELL
                </button>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
                <InputField label="Price (USD)" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                <InputField label={`Amount (${asset.ticker.replace('$', '')})`} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t border-stardust-grey/20">
                <div className="flex justify-between text-sm">
                    <span className="text-stardust-grey">Total</span>
                    <span className="font-fira-code text-bright-white">{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-6">
                <button
                    onClick={handlePlaceOrder}
                    className={`w-full font-bold py-3 rounded-lg text-void-black transition-all duration-300 transform hover:scale-105
          ${orderType === 'buy' ? 'bg-gradient-to-r from-supernova-green/80 to-supernova-green' : 'bg-gradient-to-r from-red-giant/80 to-red-giant'}
          hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]`}
                >
                    Place {orderType.toUpperCase()} Order
                </button>
            </div>
        </div>
    );
};

export default CommandModule;