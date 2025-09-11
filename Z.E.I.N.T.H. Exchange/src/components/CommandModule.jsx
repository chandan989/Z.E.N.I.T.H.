import React from 'react';

const CommandModule = () => {
    return (
        <div className="flex flex-col h-full bg-dark-matter border-l border-gray-800">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-white font-bold text-lg">Command Module</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {/* Order Book and Trade Terminal */}
                <div className="font-data">
                    {/* Placeholder for Order Book */}
                    <div className="mb-4">
                        <h3 className="text-stardust-grey mb-2">Order Book</h3>
                        <div className="text-xs">
                            <div className="flex justify-between text-red-giant"><p>126.00</p> <p>0.5</p> <p>63.00</p></div>
                            <div className="flex justify-between text-red-giant"><p>125.75</p> <p>1.2</p> <p>150.90</p></div>
                            <div className="flex justify-between text-supernova-green"><p>125.50</p> <p>2.0</p> <p>251.00</p></div>
                            <div className="flex justify-between text-supernova-green"><p>125.25</p> <p>1.8</p> <p>225.45</p></div>
                        </div>
                    </div>

                    {/* Placeholder for Trade Terminal */}
                    <div>
                        <h3 className="text-stardust-grey mb-2">Trade Terminal</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Price" className="w-full h-10 bg-void-black text-white placeholder-gray-500 px-4 rounded-lg outline-none border border-gray-700 focus:border-celestial-blue" />
                            <input type="text" placeholder="Amount" className="w-full h-10 bg-void-black text-white placeholder-gray-500 px-4 rounded-lg outline-none border border-gray-700 focus:border-celestial-blue" />
                            <div className="flex space-x-4">
                                <button className="w-full bg-supernova-green text-void-black font-bold py-2 px-4 rounded-lg hover:opacity-90">Buy</button>
                                <button className="w-full bg-red-giant text-void-black font-bold py-2 px-4 rounded-lg hover:opacity-90">Sell</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandModule;