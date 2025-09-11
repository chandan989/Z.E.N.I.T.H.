import React, { useState, useEffect, useMemo, useRef } from 'react';

const Skychart = () => {
    const [timeframe, setTimeframe] = useState('1D');
    const [chartData, setChartData] = useState({ price: 0, change: 0, changePercent: 0, history: [] });
    const [hoverData, setHoverData] = useState(null);
    const chartRef = useRef(null);

    const timeframes = ['1D', '7D', '1M', '1Y', 'ALL'];

    useEffect(() => {
        const generateChartData = (tf) => {
            let basePrice, priceFluctuation, changeFluctuation, points;
            switch(tf) {
                case '7D': basePrice = 1.15; priceFluctuation = 0.1; changeFluctuation = 5; points = 28; break;
                case '1M': basePrice = 1.30; priceFluctuation = 0.2; changeFluctuation = 15; points = 30; break;
                case '1Y': basePrice = 2.50; priceFluctuation = 0.5; changeFluctuation = 50; points = 52; break;
                case 'ALL': basePrice = 0.50; priceFluctuation = 0.1; changeFluctuation = 150; points = 60; break;
                default:   basePrice = 1.25; priceFluctuation = 0.05; changeFluctuation = 2; points = 24; break; // 1D
            }

            const history = Array.from({ length: points }, (_, i) => {
                const noise = (Math.random() - 0.5) * priceFluctuation * (1 + i/points * 2);
                return basePrice + noise;
            });

            const price = history[history.length - 1];
            const change = price - history[0];
            const changePercent = (change / history[0]) * 100;

            setChartData({ price, change, changePercent, history });
        };

        generateChartData(timeframe);
        const interval = setInterval(() => generateChartData(timeframe), 3000);
        return () => clearInterval(interval);
    }, [timeframe]);

    const isPositive = chartData.change >= 0;

    const chartDimensions = { width: 500, height: 200 };

    const { path, min, max } = useMemo(() => {
        if (chartData.history.length < 2) return { path: "", min: 0, max: 0 };
        const data = chartData.history;
        const localMin = Math.min(...data) * 0.98;
        const localMax = Math.max(...data) * 1.02;

        const points = data.map((p, i) => {
            const x = (i / (data.length - 1)) * chartDimensions.width;
            const y = chartDimensions.height - ((p - localMin) / (localMax - localMin)) * chartDimensions.height;
            return `${x},${y}`;
        });

        return { path: `M ${points.join(' L ')}`, min: localMin, max: localMax };
    }, [chartData.history]);

    const handleMouseMove = (e) => {
        if (!chartRef.current || chartData.history.length < 2) return;
        const rect = chartRef.current.getBoundingClientRect();
        const domX = e.clientX - rect.left;
        
        const dataIndex = Math.min(chartData.history.length - 1, Math.max(0, Math.round((domX / rect.width) * (chartData.history.length - 1))));
        const pointValue = chartData.history[dataIndex];

        if (pointValue) {
            const svgX = (dataIndex / (chartData.history.length - 1)) * chartDimensions.width;
            const svgY = chartDimensions.height - ((pointValue - min) / (max - min)) * chartDimensions.height;
            
            const tooltipX = (svgX / chartDimensions.width) * rect.width;
            const tooltipY = (svgY / chartDimensions.height) * rect.height;

            setHoverData({ svgX, svgY, tooltipX, tooltipY, value: pointValue });
        }
    };

    const handleMouseLeave = () => {
        setHoverData(null);
    };

    return (
        <div className="bg-dark-matter border border-gray-800 rounded-xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-3xl font-data text-white">${chartData.price.toFixed(4)}</p>
                    <p className={`font-data text-lg ${isPositive ? 'text-supernova-green' : 'text-red-giant'}`}>
                        {isPositive ? '+' : ''}{chartData.change.toFixed(4)} ({isPositive ? '+' : ''}{chartData.changePercent.toFixed(2)}%)
                    </p>
                </div>
                <div className="flex space-x-1 bg-void-black p-1 rounded-lg">
                    {timeframes.map(tf => (
                        <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeframe === tf ? 'bg-celestial-blue text-void-black' : 'text-stardust-grey hover:bg-gray-800'}`}>
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={chartRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="flex-grow flex items-center justify-center mt-4 relative">
                {chartData.history.length > 1 && (
                    <svg viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`} className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={isPositive ? '#22C55E' : '#DC2626'} stopOpacity={0.2} />
                                <stop offset="100%" stopColor={isPositive ? '#22C55E' : '#DC2626'} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <path d={`${path} L ${chartDimensions.width},${chartDimensions.height} L 0,${chartDimensions.height} Z`} fill="url(#chartGradient)" />
                        <path d={path} fill="none" stroke={isPositive ? '#22C55E' : '#DC2626'} strokeWidth="2" />
                        {hoverData && (
                            <g>
                                <line x1={hoverData.svgX} y1="0" x2={hoverData.svgX} y2={chartDimensions.height} stroke="#A1A1AA" strokeWidth="1" strokeDasharray="3,3" />
                                <circle cx={hoverData.svgX} cy={hoverData.svgY} r="4" fill={isPositive ? '#22C55E' : '#DC2626'} />
                            </g>
                        )}
                    </svg>
                )}
                {hoverData && (
                    <div className="absolute bg-void-black/80 backdrop-blur-sm text-white text-xs rounded-lg p-2 pointer-events-none border border-gray-700 shadow-lg"
                         style={{ left: hoverData.tooltipX, top: hoverData.tooltipY, transform: 'translate(-50%, -120%)' }}>
                        ${hoverData.value.toFixed(4)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Skychart;
