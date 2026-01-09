'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { ShoppingBag, Loader2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

function ProductsContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // Fetch specific category if present, otherwise trending
                const query = category || 'trending';
                const response = await api.get(`/api/v1/products/search?q=${query}`);

                if (response.data && response.data.results) {
                    setProducts(response.data.results);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const title = category
        ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
        : 'Trending Products';

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'default') return 0;

        const priceA = Number(a.price.replace(/[^0-9.-]+/g, ""));
        const priceB = Number(b.price.replace(/[^0-9.-]+/g, ""));

        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    return (
        <main className="container mx-auto px-4 pt-24 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        {category ? (
                            <Filter className="w-8 h-8 text-blue-400" />
                        ) : (
                            <ShoppingBag className="w-8 h-8 text-blue-400" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{title}</h1>
                        {category && <p className="text-gray-400 text-sm mt-1">Showing top results for {title}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'default' | 'asc' | 'desc')}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer hover:bg-white/10"
                    >
                        <option value="default" className="bg-[#030712] text-gray-400">Sort by: Relevance</option>
                        <option value="asc" className="bg-[#030712]">Price: Low to High</option>
                        <option value="desc" className="bg-[#030712]">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedProducts.length > 0 ? (
                        sortedProducts.map((product, idx) => (
                            <motion.div
                                key={product.product_id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No products found for this category.
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-[#030712] text-white">
            <Navbar />
            <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            }>
                <ProductsContent />
            </Suspense>
        </div>
    );
}
