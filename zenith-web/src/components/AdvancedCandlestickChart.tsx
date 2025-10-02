
import React from 'react';
import * as Recharts from 'recharts';
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

const ohlcData = [
    { time: '2024-07-15', open: 165.2, high: 166.4, low: 163.8, close: 164.9 },
    { time: '2024-07-16', open: 164.9, high: 168.2, low: 164.5, close: 167.8 },
    { time: '2024-07-17', open: 167.8, high: 169.1, low: 166.5, close: 168.5 },
    { time: '2024-07-18', open: 168.5, high: 170.3, low: 168.1, close: 169.9 },
    { time: '2024-07-19', open: 169.9, high: 171.2, low: 169.5, close: 170.8 },
    { time: '2024-07-22', open: 170.8, high: 172.5, low: 170.1, close: 172.2 },
    { time: '2024-07-23', open: 172.2, high: 173.0, low: 171.5, close: 171.8 },
    { time: '2024-07-24', open: 171.8, high: 174.2, low: 171.6, close: 173.9 },
    { time: '2024-07-25', open: 173.9, high: 175.1, low: 173.5, close: 174.8 },
    { time: '2024-07-26', open: 174.8, high: 176.3, low: 174.5, close: 175.9 },
].map(d => ({ ...d, range: [d.low, d.high] }));

const CandlestickShape = (props: any) => {
    const { x, y, width, height, payload } = props;
    const { open, close, high, low } = payload;
    const isBullish = close >= open;
    const fill = isBullish ? '#26a69a' : '#ef5350';
    const wickStroke = isBullish ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)';

    if (height <= 0) return null;

    const wickX = x + width / 2;

    const priceToY = (price: number) => y + ((high - price) / (high - low)) * height;

    const bodyY = priceToY(Math.max(open, close));
    const bodyHeight = Math.max(1, Math.abs(priceToY(open) - priceToY(close)));

    return (
        <g>
            <path d={`M ${wickX},${y} L ${wickX},${y + height}`} stroke={wickStroke} strokeWidth={1} />
            <rect x={x} y={bodyY} width={width} height={bodyHeight} fill={fill} />
        </g>
    );
};

const chartConfig = {
    price: {
        label: "Price Range",
    },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="p-2 bg-card/80 border border-border/50 rounded-lg backdrop-blur-sm text-xs font-mono">
                <p className="text-stardust-grey">{data.time}</p>
                <p><span className="font-bold text-white">O:</span> {data.open}</p>
                <p><span className="font-bold text-white">H:</span> {data.high}</p>
                <p><span className="font-bold text-white">L:</span> {data.low}</p>
                <p><span className="font-bold text-white">C:</span> {data.close}</p>
            </div>
        );
    }
    return null;
};

const AdvancedCandlestickChart = () => {
    return (
        <ChartContainer config={chartConfig} className="h-full w-full">
            <Recharts.BarChart
                data={ohlcData}
                margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
            >
                <Recharts.CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                <Recharts.XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <Recharts.YAxis
                    domain={['dataMin - 5', 'dataMax + 5']}
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
                    tickFormatter={(val) => `$${Number(val).toFixed(0)}`}
                />
                <Recharts.Tooltip cursor={{ stroke: 'rgba(255, 255, 255, 0.2)', strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Recharts.Bar
                    dataKey="range"
                    shape={<CandlestickShape />}
                />
            </Recharts.BarChart>
        </ChartContainer>
    );
};

export default AdvancedCandlestickChart;
