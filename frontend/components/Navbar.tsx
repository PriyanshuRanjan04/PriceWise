'use client';

import Link from 'next/link';
import { ShoppingBag, MessageSquare, Menu, Flame, TrendingDown, Layers, HelpCircle, Heart } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const Navbar = () => {
    const { user, isSignedIn } = useUser();

    useEffect(() => {
        if (isSignedIn && user) {
            const syncUser = async () => {
                try {
                    await api.post('/api/v1/user/sync', {
                        clerk_id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        first_name: user.firstName,
                        last_name: user.lastName
                    });
                } catch (error) {
                    console.error('Failed to sync user:', error);
                }
            };
            syncUser();
        }
    }, [isSignedIn, user]);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/50 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                            PRICE<span className="text-blue-500">WISE</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/products" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" /> Products
                            </Link>
                            <Link href="/categories" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Categories
                            </Link>
                            <Link href="/saved" className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2">
                                <Heart className="w-4 h-4" /> Saved Items
                            </Link>
                            <Link href="/chat" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> AI Assistant
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 border-r border-white/10 pr-6 mr-2">
                            <Link href="/deals" className="text-xs font-bold text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-1.5 uppercase tracking-wide">
                                <Flame className="w-3.5 h-3.5" /> Deals
                            </Link>
                            <Link href="/#track" className="text-xs font-bold text-gray-500 hover:text-green-500 transition-colors flex items-center gap-1.5 uppercase tracking-wide">
                                <TrendingDown className="w-3.5 h-3.5" /> Track
                            </Link>
                            <Link href="/about" className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wide">
                                <HelpCircle className="w-3.5 h-3.5" /> Help
                            </Link>
                        </div>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="px-6 py-2.5 rounded-full text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-lg active:scale-95">
                                    Sign in
                                </button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10 ring-2 ring-white/20 hover:ring-white/40 transition-all"
                                    }
                                }}
                            />
                        </SignedIn>

                        <button
                            className="md:hidden p-2 text-gray-400 hover:text-white"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 bg-[#030712] overflow-hidden"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            <Link
                                href="/products"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                            >
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><ShoppingBag size={20} /></div>
                                <span className="font-semibold">Products</span>
                            </Link>
                            <Link
                                href="/categories"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                            >
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Layers size={20} /></div>
                                <span className="font-semibold">Categories</span>
                            </Link>
                            <Link
                                href="/saved"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                            >
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><Heart size={20} /></div>
                                <span className="font-semibold">Saved Items</span>
                            </Link>
                            <Link
                                href="/chat"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                            >
                                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><MessageSquare size={20} /></div>
                                <span className="font-semibold">AI Assistant</span>
                            </Link>

                            <div className="h-px bg-white/10 my-2" />

                            <Link href="/deals" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white">
                                <Flame size={16} /> Hot Deals
                            </Link>
                            <Link href="/#track" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white">
                                <TrendingDown size={16} /> Track Prices
                            </Link>
                            <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white">
                                <HelpCircle size={16} /> Help Center
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
