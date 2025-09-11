import React from 'react';

const Skychart = () => {
    return (
        <div className="flex flex-col h-full bg-void-black">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-white font-bold text-lg font-data">DOMAIN.COM / $DMC</h2>
            </div>
            <div className="flex-grow flex items-center justify-center">
                {/* Placeholder for TradingView Chart */}
                <div className="text-stardust-grey">
                    TradingView Chart Placeholder
                </div>
            </div>
        </div>
    );
};

export default Skychart;