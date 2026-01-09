'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingCart, RefreshCw, Smartphone } from 'lucide-react'; // Changed icon for variety
import { useState, useEffect } from 'react';

const LiveDemo = () => {
    const [step, setStep] = useState(0); // 0: Scanning, 1: Amazon, 2: Flipkart, 3: Winner

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 5); // 5 steps (4 is reset/pause)
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    // Reset loop effect
    useEffect(() => {
        if (step === 4) {
            setTimeout(() => setStep(0), 500);
        }
    }, [step]);

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4 uppercase tracking-wider"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span>Live System Status: Active</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                        See it in <span className="text-blue-500">Action</span>
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-lg mx-auto">
                        Simulating real-time price extraction engine...
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative h-[300px] flex items-center justify-center">
                    {/* Connecting Line / Scanner */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm pointer-events-none" />

                    {step === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center flex-col gap-4"
                        >
                            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
                            <span className="text-blue-400 font-mono text-sm">SCANNING RETAILERS...</span>
                        </motion.div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8 items-center relative z-10 w-full">
                        {/* Amazon Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                            animate={{
                                opacity: step >= 1 ? 1 : 0.3,
                                x: step >= 1 ? 0 : -20,
                                filter: step >= 1 ? 'blur(0px)' : 'blur(5px)'
                            }}
                            className={`bg-[#131921] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden transition-all duration-500 ${step >= 1 ? 'scale-100' : 'scale-95'}`}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                                    <ShoppingCart className="text-black w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Amazon</h3>
                                    <p className="text-sm text-gray-400">iPhone 15 • 128GB</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 font-bold uppercase">Price Found</p>
                                    <p className="text-3xl font-black text-white">
                                        {step >= 1 ? '₹72,999' : '---,---'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Vs Badge */}
                        <motion.div
                            animate={{ scale: step >= 2 ? 1 : 0, rotate: step >= 2 ? 0 : -180 }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-[#030712] z-20 shadow-xl"
                        >
                            <span className="font-black text-sm italic">VS</span>
                        </motion.div>

                        {/* Flipkart Card - Winner */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{
                                opacity: step >= 2 ? 1 : 0.3,
                                x: step >= 2 ? 0 : 20,
                                filter: step >= 2 ? 'blur(0px)' : 'blur(5px)',
                                borderColor: step >= 3 ? 'rgba(74, 222, 128, 0.5)' : 'rgba(255,255,255,0.1)'
                            }}
                            className={`bg-[#2874f0] border rounded-3xl p-6 shadow-2xl relative overflow-hidden transition-all duration-500 ${step >= 3 ? 'ring-4 ring-green-400/30 scale-105' : 'scale-100'}`}
                        >
                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                                    <ShoppingBagIcon />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Flipkart</h3>
                                    <p className="text-sm text-blue-100">iPhone 15 • 128GB</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between relative">
                                <div className="space-y-1">
                                    <p className="text-xs text-blue-200 font-bold uppercase">Best Deal</p>
                                    <p className="text-3xl font-black text-white">
                                        {step >= 2 ? '₹65,999' : '---,---'}
                                    </p>
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: step >= 3 ? 1 : 0 }}
                                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                                >
                                    <Check size={12} strokeWidth={4} />
                                    Save ₹7,000
                                </motion.div>
                            </div>
                        </motion.div>
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
