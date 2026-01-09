'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product';
import { ExternalLink, Star, ShoppingCart, Bell, Check } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
    const [isTracking, setIsTracking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        try {
            await api.post('/api/v1/tracker/track', product);
            setIsTracking(true);
        } catch (error) {
            console.error('Failed to track product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            onClick={onClick}
            className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 shadow-2xl cursor-pointer"
        >
            <div className="relative aspect-square w-full bg-white p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 relative z-0"
                />

                {/* Track Button Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <motion.button
                        onClick={handleTrack}
                        disabled={isTracking || isLoading}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xl overflow-hidden relative ${isTracking
                            ? 'bg-green-500 text-white border border-green-600' // Solid green for better visibility
                            : 'bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md'
                            }`}
                    >
                        <AnimatePresence mode='wait'>
                            {isTracking ? (
                                <motion.div
                                    key="tracking"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Tracking Enabled</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="track"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Bell className="w-3.5 h-3.5" />
                                    <span>Track Price</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white">
                        {product.source}
                    </span>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <h3 className="font-semibold text-lg line-clamp-2 min-h-[56px] text-gray-100 group-hover:text-blue-400 transition-colors" title={product.title}>
                    {product.title}
                </h3>

                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Best Price</span>
                        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            {product.price}
                        </div>
                    </div>

                    {product.rating && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-yellow-500">{product.rating}</span>
                        </div>
                    )}
                </div>

                <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-blue-500 hover:text-white py-4 rounded-2xl font-bold transition-all duration-300 group/btn overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        View Deal <ShoppingCart size={18} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </a>
            </div>
        </motion.div>
    );
};

export default ProductCard;
