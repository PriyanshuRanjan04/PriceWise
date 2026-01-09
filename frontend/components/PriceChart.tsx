'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface PricePoint {
    price: string | number;
    timestamp: string;
}

interface PriceChartProps {
    history: PricePoint[];
    title: string;
}

export default function PriceChart({ history, title }: PriceChartProps) {
    // Normalize data
    const data = history.map(point => {
        // Convert "₹1,499" to 1499
        const priceVal = typeof point.price === 'string'
            ? parseFloat(point.price.replace(/[^0-9.]/g, ''))
            : point.price;

        return {
            price: priceVal,
            date: new Date(point.timestamp).toLocaleDateString(),
            original: point
        };
    });

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400">No price history available yet.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                Price History <span className="text-sm font-normal text-gray-400">({title})</span>
            </h3>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#60a5fa' }}
                            labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
                            formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Price']}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#1d2333' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
