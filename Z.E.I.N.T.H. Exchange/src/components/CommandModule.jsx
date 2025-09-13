import React, { useState } from 'react';

const CommandModule = ({ asset }) => {
    const [orderType, setOrderType] = useState('buy');
    const [price, setPrice] = useState('1.25'); // Example price
    const [amount, setAmount] = useState('');

    // Mock user balance
    const userBalance = orderType === 'buy' ? 1000 : 50; // $1000 to buy, 50 of the asset to sell

    const total = (parseFloat(price) || 0) * (parseFloat(amount) || 0);

    const handleSetQuantity = (percentage) => {
        const value = orderType === 'buy'
            ? (userBalance / (parseFloat(price) || 1)) * percentage
            : userBalance * percentage;
        setAmount(value.toFixed(4));
    };

    const InputField = ({ label, value, onChange, placeholder, unit }) => (
        <div>
            <label className="block text-xs text-stardust-grey/80 mb-1.5">{label}</label>
            <div className="relative flex items-center bg-dark-matter border border-stardust-grey/20 rounded-lg transition-all duration-300 focus-within:ring-1 focus-within:ring-celestial-blue/50">
                <input
                    type="number"
                    className="w-full h-10 bg-transparent text-white placeholder-stardust-grey/50 pl-3 pr-10 font-data text-sm outline-none rounded-lg"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
                {unit && <span className="absolute right-3 text-xs text-stardust-grey/60 font-data">{unit}</span>}
            </div>
        </div>
    );

    const QuantityButton = ({ percentage }) => (
        <button 
            onClick={() => handleSetQuantity(percentage / 100)}
            className="bg-dark-matter/50 border border-stardust-grey/20 text-stardust-grey/80 text-xs rounded-md py-1 px-3 hover:bg-celestial-blue/20 hover:text-celestial-blue transition-colors"
        >
            {percentage}%
        </button>
    );

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="space-y-4">
                {/* Order Type Toggle */}
                <div className="grid grid-cols-2 gap-1 bg-dark-matter p-1 rounded-lg border border-stardust-grey/20">
                    <button onClick={() => setOrderType('buy')} className={`py-1.5 rounded-md text-sm font-bold ${orderType === 'buy' ? 'bg-supernova-green/80 text-void-black' : 'text-stardust-grey/70 hover:bg-white/5'}`}>Buy</button>
                    <button onClick={() => setOrderType('sell')} className={`py-1.5 rounded-md text-sm font-bold ${orderType === 'sell' ? 'bg-red-giant/80 text-void-black' : 'text-stardust-grey/70 hover:bg-white/5'}`}>Sell</button>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-3">
                    <InputField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" unit="USD" />
                    <InputField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" unit={asset.ticker} />
                </div>

                {/* Quick Quantity Buttons */}
                <div className="flex justify-between">
                    <QuantityButton percentage={25} />
                    <QuantityButton percentage={50} />
                    <QuantityButton percentage={75} />
                    <QuantityButton percentage={100} />
                </div>

                {/* Order Summary */}
                <div className="text-center text-xs text-stardust-grey/70 pt-2">
                    Total: <span className="font-data text-white">{total.toFixed(2)} USD</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* AI Recommendation */}
                <div className="bg-celestial-blue/10 border border-celestial-blue/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-celestial-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M12 21v-1m-6.657-3.343l.707-.707"></path></svg>
                        <h3 className="text-sm font-bold text-celestial-blue">AI Recommendation</h3>
                    </div>
                    <p className="text-xs text-stardust-grey/90 mt-1.5">Based on current volatility, a limit order at <span className="font-data text-white">$1.22</span> has a high probability of being filled within the next hour.</p>
                </div>

                {/* Action Button */}
                <button
                    className={`w-full font-bold py-3 rounded-lg text-void-black transition-all duration-300 transform hover:scale-105 ${orderType === 'buy' ? 'bg-supernova-green' : 'bg-red-giant'}`}
                >
                    Place {orderType.toUpperCase()} Order
                </button>
            </div>
        </div>
    );
};

export default CommandModule;
