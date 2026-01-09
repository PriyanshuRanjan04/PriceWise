'use client';

import { motion } from 'framer-motion';
import { Check, ShoppingCart } from 'lucide-react';

const LiveDemo = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4 uppercase tracking-wider"
                    >
                        <span>Live Comparison</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black tracking-tight"
                    >
                        See it in <span className="text-blue-500">Action</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-gray-400 max-w-lg mx-auto"
                    >
                        Real-time price comparison happening right now.
                    </motion.p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-32 -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

                    <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                        {/* Amazon Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#131921] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <span className="text-white/20 font-black text-6xl">A</span>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                                    <ShoppingCart className="text-black w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Amazon</h3>
                                    <p className="text-sm text-gray-400">Deep Black • 128GB</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 font-bold uppercase">Current Price</p>
                                    <p className="text-3xl font-black text-white">₹72,999</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-red-400 font-bold">High Price</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Vs Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center border-4 border-[#030712] z-20 shadow-xl"
                        >
                            <span className="font-black text-xl italic">VS</span>
                        </motion.div>

                        {/* Flipkart Card - Winner */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-[#2874f0] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden ring-4 ring-green-400/30"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <span className="text-white font-black text-6xl">F</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                                    <ShoppingBagIcon />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Flipkart</h3>
                                    <p className="text-sm text-blue-100">Deep Black • 128GB</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative">
                                <div className="space-y-1">
                                    <p className="text-xs text-blue-200 font-bold uppercase">Best Deal</p>
                                    <p className="text-3xl font-black text-white">₹65,999</p>
                                </div>
                                <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    <Check size={12} strokeWidth={4} />
                                    Save ₹7,000
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-500">iPhone 15 • Live Comparison Example</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Custom Icon for variety
const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

export default LiveDemo;
