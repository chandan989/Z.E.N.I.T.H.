import React from 'react';

const AssetNavigator = () => {
    return (
        <div className="flex flex-col h-full bg-dark-matter border-r border-gray-800">
            <div className="p-4 border-b border-gray-800">
                <input
                    type="text"
                    placeholder="Search Assets..."
                    className="w-full h-10 bg-void-black text-white placeholder-gray-500 px-4 rounded-lg outline-none border border-gray-700 focus:border-celestial-blue"
                />
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {/* Tabs */}
                <div className="flex space-x-4 mb-4">
                    <button className="text-white font-bold pb-2 border-b-2 border-celestial-blue">All Assets</button>
                    <button className="text-stardust-grey hover:text-white">Options</button>
                    <button className="text-stardust-grey hover:text-white">Constellations</button>
                </div>

                {/* Asset List */}
                <div>
                    {/* Example Asset */}
                    <div className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                        <div className="flex justify-between items-center font-data">
                            <div className="font-bold text-white">DOMAIN.COM</div>
                            <div className="text-supernova-green">$125.50</div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-stardust-grey font-data">
                            <div>$DMC</div>
                            <div>+2.5%</div>
                        </div>
                    </div>
                    {/* Add more assets here */}
                </div>
            </div>
        </div>
    );
};

export default AssetNavigator;