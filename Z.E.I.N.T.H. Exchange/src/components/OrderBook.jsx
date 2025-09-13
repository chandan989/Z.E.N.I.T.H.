// Z.E.I.N.T.H. Exchange/src/components/OrderBook.jsx
import React from 'react';

const OrderBook = () => {
    // Mock data, in a real app this would come from a WebSocket
    const asks = [[12502.5, 0.5], [12502.0, 1.2], [12501.5, 2.0]];
    const bids = [[12500.0, 2.5], [12499.5, 1.8], [12499.0, 1.0]];

    const OrderRow = ({ price, size, type }) => (
        <div className="flex justify-between items-center text-xs font-fira-code p-1">
            <span className={type === 'ask' ? 'text-red-giant' : 'text-supernova-green'}>{price.toFixed(2)}</span>
            <span>{size.toFixed(4)}</span>
            <span>{(price * size).toFixed(2)}</span>
        </div>
    );

    return (
        <div className="bg-dark-matter/50 h-full p-3 rounded-lg flex flex-col">
            <h3 className="text-sm font-bold text-bright-white mb-2">Order Book</h3>
            <div className="flex justify-between text-xs text-stardust-grey/50 px-1 mb-1">
                <span>Price (USD)</span>
                <span>Size</span>
                <span>Total</span>
            </div>
            <div className="flex-grow flex flex-col justify-between">
                <div>{asks.map(([price, size]) => <OrderRow key={price} price={price} size={size} type="ask" />)}</div>
                <div className="py-2 text-center text-lg font-bold text-bright-white">12,500.50</div>
                <div>{bids.map(([price, size]) => <OrderRow key={price} price={price} size={size} type="bid" />)}</div>
            </div>
        </div>
    );
};

export default OrderBook;