import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingDown, Calendar, ArrowUpRight, ExternalLink } from 'lucide-react';
import { Product } from '@/types/product';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState } from 'react';

interface ProductDetailsModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

// Mock Data Generator
const generateHistory = (days: number, basePrice: number) => {
    const data = [];
    const now = new Date();

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        // Random fluctuation within 10%
        const fluctuation = basePrice * 0.1 * (Math.random() - 0.5);

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: Math.round(basePrice + fluctuation)
        });
    }
    return data;
};

const ProductDetailsModal = ({ product, isOpen, onClose }: ProductDetailsModalProps) => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

    if (!product) return null;

    // Extract numeric price for mock data
    const basePrice = parseInt(product.price.replace(/[^0-9]/g, '')) || 50000;
    const historyData = generateHistory(timeRange === '7d' ? 7 : 30, basePrice);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0f172a] border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="grid md:grid-cols-2">
                                {/* Visual Side */}
                                <div className="p-8 bg-white flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent" />
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="w-full max-w-[300px] object-contain relative z-10 mix-blend-multiply"
                                    />
                                    <div className="mt-8 flex gap-4">
                                        {product.thumbnail && [1, 2, 3].map(i => (
                                            <div key={i} className="w-16 h-16 rounded-xl border border-gray-200 p-2 bg-white">
                                                <img src={product.thumbnail} className="w-full h-full object-contain" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Details Side */}
                                <div className="p-8 text-white space-y-8">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase mb-4">
                                            {product.source}
                                        </div>
                                        <h2 className="text-2xl font-bold leading-tight">{product.title}</h2>
                                    </div>

                                    <div className="flex items-end gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400 font-medium mb-1">Current Best Price</p>
                                            <div className="text-4xl font-black text-white">{product.price}</div>
                                        </div>
                                        <div className="mb-2 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-bold flex items-center gap-1">
                                            <TrendingDown size={14} />
                                            Low Price
                                        </div>
                                    </div>

                                    {/* Graph Section */}
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                                <Calendar size={14} />
                                                Price History
                                            </div>
                                            <div className="flex bg-black/40 rounded-lg p-1">
                                                <button
                                                    onClick={() => setTimeRange('7d')}
                                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${timeRange === '7d' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    7 Days
                                                </button>
                                                <button
                                                    onClick={() => setTimeRange('30d')}
                                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${timeRange === '30d' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    30 Days
                                                </button>
                                            </div>
                                        </div>

                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={historyData}>
                                                    <defs>
                                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis
                                                        dataKey="date"
                                                        tick={{ fontSize: 10, fill: '#6b7280' }}
                                                        tickLine={false}
                                                        axisLine={false}
                                                    />
                                                    <YAxis
                                                        hide={true}
                                                        domain={['dataMin - 1000', 'dataMax + 1000']}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        formatter={(value: any) => [`₹${value}`, 'Price']}
                                                        labelStyle={{ display: 'none' }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="price"
                                                        stroke="#3b82f6"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#colorPrice)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <a
                                        href={product.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        View Deal on {product.source}
                                        <ArrowUpRight size={18} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailsModal;
