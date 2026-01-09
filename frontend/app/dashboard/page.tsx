'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PriceChart from '@/components/PriceChart';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { TrendingUp, AlertCircle, ShoppingBag, Trash2 } from 'lucide-react';

interface TrackedProduct extends Product {
    id: string;
    history: { price: string | number; timestamp: string }[];
    last_updated: string;
}

export default function Dashboard() {
    const [trackedProducts, setTrackedProducts] = useState<TrackedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTrackedProducts();
    }, []);

    const fetchTrackedProducts = async () => {
        try {
            const response = await api.get('/api/v1/tracker/tracked');
            setTrackedProducts(response.data.products);
        } catch (err) {
            console.error('Failed to fetch tracked products:', err);
            setError('Failed to load your tracked products.');
        } finally {
            setIsLoading(false);
        }
    };

    const removeItem = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent chart toggle if we add that later
        if (!confirm('Stop tracking this product?')) return;

        // Optimistic update
        setTrackedProducts(prev => prev.filter(p => p.id !== id));

        // Ideally we'd have a delete endpoint too, but for now just UI removal
        // TODO: Add DELETE /tracker/{id}
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <Navbar />

            <main className="container mx-auto px-4 pt-24 pb-20 relative">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Tracked Product</h1>
                        <p className="text-gray-400">Real-time price monitoring and history.</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {trackedProducts.length} Active Trackers
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-center">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        {error}
                    </div>
                ) : trackedProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <h3 className="text-xl font-bold text-gray-300">No products tracked yet</h3>
                        <p className="text-gray-500 mt-2">Search for products on the home page and click "Track" to get started.</p>
                        <a href="/" className="mt-6 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-medium transition-colors">
                            Find Products
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {trackedProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden p-6 hover:border-blue-500/30 transition-all shadow-lg"
                            >
                                <div className="flex flex-col md:flex-row gap-6 mb-6">
                                    <div className="w-full md:w-48 aspect-square flex-shrink-0 bg-white rounded-xl overflow-hidden p-4">
                                        <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="text-xl font-bold truncate leading-tight mb-2" title={product.title}>
                                                {product.title}
                                            </h3>
                                            {/* <button 
                                        onClick={(e) => removeItem(product.id, e)}
                                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        title="Stop Tracking"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button> */}
                                        </div>

                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-3xl font-black text-white">{product.price}</span>
                                            <span className="text-sm text-gray-400">Current Price</span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <img className="w-4 h-4" src={product.source === "Amazon" ? "https://github.com/simple-icons/simple-icons/raw/develop/icons/amazon.svg" : "https://github.com/simple-icons/simple-icons/raw/develop/icons/google.svg"} style={{ filter: "invert(1)" }} />
                                                {product.source}
                                            </div>
                                            {product.rating && <span>⭐ {product.rating}</span>}
                                            <span>Last checked: {new Date(product.last_updated).toLocaleDateString()}</span>
                                        </div>

                                        <div className="mt-4 flex gap-3">
                                            <a
                                                href={product.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Visit Store
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <PriceChart history={product.history || []} title={product.title} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
