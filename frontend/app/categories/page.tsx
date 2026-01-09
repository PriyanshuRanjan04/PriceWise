'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import { Smartphone, Laptop, Footprints, Shirt, Watch, Monitor, Headphones, SlidersHorizontal, Sparkles, TrendingDown } from 'lucide-react';
import Link from 'next/link';

// Detailed Category Data
const categories = [
    {
        id: 'phones',
        name: 'Phones',
        icon: Smartphone,
        count: '1.2k+ Items',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
        aiRecommended: true,
        priceDrop: true
    },
    {
        id: 'laptops',
        name: 'Laptops',
        icon: Laptop,
        count: '850+ Items',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'shoes',
        name: 'Shoes',
        icon: Footprints,
        count: '3.4k+ Items',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'men-clothing',
        name: "Men's Clothing",
        icon: Shirt,
        count: '5k+ Items',
        image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'women-clothing',
        name: "Women's Clothing",
        icon: Shirt,
        count: '6.2k+ Items',
        image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'electronics',
        name: 'Electronics',
        icon: Monitor,
        count: '2.1k+ Items',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'accessories',
        name: 'Accessories',
        icon: Watch,
        count: '4.5k+ Items',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'audio',
        name: 'Audio',
        icon: Headphones,
        count: '900+ Items',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'
    }
];

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Personalized</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black tracking-tight"
                        >
                            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Categories</span>
                        </motion.h1>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, idx) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link href={`/products?category=${category.id}`} className="group block relative h-[300px] rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-500">
                                {/* Image Background */}
                                <div className="absolute inset-0">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    {category.aiRecommended && (
                                        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                            <div className="px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold shadow-lg shadow-blue-500/20 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                Top Pick
                                            </div>
                                            {category.priceDrop && (
                                                <div className="px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-bold shadow-lg shadow-green-500/20 flex items-center gap-1 animate-pulse">
                                                    <TrendingDown className="w-3 h-3" />
                                                    Price Drop
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center mb-4 text-white group-hover:bg-blue-500 group-hover:border-blue-400 transition-colors">
                                            <category.icon className="w-6 h-6" />
                                        </div>

                                        <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{category.count}</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
            <ChatInterface />
        </div>
    );
}
