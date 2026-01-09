'use client';

import { motion } from 'framer-motion';
import { Timer, Zap, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

const DEAL_END_TIME = new Date().getTime() + 86400000; // 24 hours from now

const PopularDeals = () => {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = DEAL_END_TIME - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    return (
        <section className="py-12">
            <div className="flex items-center justify-between mb-8 px-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
                    </div>
                    <h2 className="text-2xl font-black">Flash Deals</h2>
                </div>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full font-mono text-sm">
                    <Timer className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-400 font-bold text-xs uppercase mr-2">Ends in</span>
                    <span className="font-bold">{formatTime(timeLeft.hours)}h : {formatTime(timeLeft.minutes)}m : {formatTime(timeLeft.seconds)}s</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 px-4">
                {/* Deal Card 1 - Left */}
                <motion.div
                    whileHover="hover"
                    className="relative h-[250px] w-full cursor-pointer perspective-1000"
                >
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-transform duration-700"
                        variants={{
                            hover: { rotateY: 180 }
                        }}
                    >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1a1f2e] to-[#0f172a] rounded-3xl border border-white/10 p-6 flex items-center justify-between overflow-hidden">
                            <div className="z-10 space-y-4">
                                <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-bold inline-flex items-center gap-1">
                                    <Zap size={12} className="fill-red-500" />
                                    45% OFF
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">Sony WH-1000XM5</h3>
                                    <p className="text-gray-400 text-sm">Noise Cancelling Headphones</p>
                                </div>
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-black text-white">₹19,999</span>
                                    <span className="text-lg text-gray-500 line-through decoration-red-500/50">₹34,990</span>
                                </div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=500&auto=format&fit=crop"
                                alt="Headphones"
                                className="w-48 h-48 object-contain drop-shadow-2xl absolute -right-4 -bottom-4 rotate-[-15deg]"
                            />
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                            <h4 className="text-2xl font-black mb-2">Deal Unlocked!</h4>
                            <p className="text-blue-100 mb-6 text-sm">Valid for next 15 minutes only.</p>
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">
                                Claim Offer
                            </button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Deal Card 2 - Right */}
                <motion.div
                    whileHover="hover"
                    className="relative h-[250px] w-full cursor-pointer perspective-1000"
                >
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-transform duration-700"
                        variants={{
                            hover: { rotateY: 180 }
                        }}
                    >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1a1f2e] to-[#0f172a] rounded-3xl border border-white/10 p-6 flex items-center justify-between overflow-hidden">
                            <div className="z-10 space-y-4">
                                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold inline-flex items-center gap-1">
                                    <Star size={12} className="fill-green-500" />
                                    BEST SELLER
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">MacBook Air M2</h3>
                                    <p className="text-gray-400 text-sm">Midnight • 256GB SSD</p>
                                </div>
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-black text-white">₹89,900</span>
                                    <span className="text-lg text-gray-500 line-through decoration-red-500/50">₹1,14,900</span>
                                </div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=500&auto=format&fit=crop"
                                alt="Macbook"
                                className="w-56 h-56 object-contain drop-shadow-2xl absolute -right-8 -bottom-8 rotate-[10deg]"
                            />
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-purple-600 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                            <h4 className="text-2xl font-black mb-2">Student Discount</h4>
                            <p className="text-purple-100 mb-6 text-sm">Save extra ₹10,000 with student ID.</p>
                            <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">
                                Verify & Buy
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default PopularDeals;
