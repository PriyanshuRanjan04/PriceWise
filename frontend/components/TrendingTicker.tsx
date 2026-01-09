'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Search } from 'lucide-react';

const TRENDING_ITEMS = [
    "iPhone 15 Pro", "Sony WH-1000XM5", "MacBook Air M3", "Samsung S24 Ultra", "Nike Air Jordan", "PS5 Slim", "Dyson Airwrap"
];

const TrendingTicker = ({ onSearch }: { onSearch: (term: string) => void }) => {
    return (
        <div className="w-full overflow-hidden border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-3 mt-8 relative group">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#030712] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#030712] to-transparent z-10" />

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 z-20 bg-[#030712] border-r border-white/10 h-full py-1">
                    <TrendingUp className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 whitespace-nowrap">Trending Now</span>
                </div>

                <div className="flex overflow-hidden mask-linear-gradient w-full">
                    <motion.div
                        className="flex gap-8 whitespace-nowrap"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 25,
                            repeatType: "loop"
                        }}
                    >
                        {[...TRENDING_ITEMS, ...TRENDING_ITEMS, ...TRENDING_ITEMS].map((item, idx) => (
                            <button
                                key={`${item}-${idx}`}
                                onClick={() => onSearch(item)}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 group/item"
                            >
                                <Search className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                {item}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TrendingTicker;
