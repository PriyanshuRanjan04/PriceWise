'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { Heart, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';

export default function SavedPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [bookmarks, setBookmarks] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Seed global Zustand store with bookmarked IDs
    const setBookmarkedIds = useUserStore((s) => s.setBookmarkedIds);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                const response = await api.get(`/api/v1/user/${user.id}/bookmarks`);
                if (response.data) {
                    // Backend returns [{ user_id, product: {...}, timestamp }, ...]
                    const products: Product[] = response.data.map((item: any) => item.product);
                    setBookmarks(products);

                    // ✅ Seed Zustand so heart icons across ALL pages reflect saved state
                    const ids = products
                        .map((p) => p.product_id)
                        .filter((id): id is string => Boolean(id));
                    setBookmarkedIds(ids);
                }
            } catch (error) {
                console.error('Failed to fetch bookmarks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoaded && isSignedIn) {
            fetchBookmarks();
        } else if (isLoaded && !isSignedIn) {
            setIsLoading(false);
        }
    }, [isLoaded, isSignedIn, user, setBookmarkedIds]);

    // Listen for bookmark removals from ProductCard — keep local list in sync
    const bookmarkedIds = useUserStore((s) => s.bookmarkedIds);
    const visibleBookmarks = bookmarks.filter(
        (p) => !p.product_id || bookmarkedIds.has(p.product_id)
    );

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white">
            <Navbar />
            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500/10 rounded-2xl">
                        <Heart className="w-8 h-8 text-red-400 fill-red-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Saved Items</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {visibleBookmarks.length > 0
                                ? `${visibleBookmarks.length} item${visibleBookmarks.length !== 1 ? 's' : ''} saved`
                                : 'Your personal wishlist'}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <>
                        {visibleBookmarks.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {visibleBookmarks.map((product, idx) => (
                                    <motion.div
                                        key={product.product_id || idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        layout
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10"
                            >
                                <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
                                    <Heart className="w-12 h-12 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No saved items yet</h3>
                                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                    Start exploring products and save your favorites to track them here.
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-bold transition-all"
                                >
                                    Explore Products <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
