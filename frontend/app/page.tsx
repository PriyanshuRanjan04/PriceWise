'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get(`/api/v1/products/search?q=${query}`);
      setProducts(response.data.results);
    } catch (error) {
      console.error('Search failed:', error);
      // Optional: Add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className={`transition-all duration-500 ${hasSearched ? 'mt-0' : 'mt-20'}`}>
          <div className="text-center mb-10 space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
              PriceWise
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              AI-powered price comparison across major retailers.
              Find the best deals instantly.
            </p>
          </div>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Section */}
        <div className="mt-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, idx) => (
                <ProductCard key={product.product_id || idx} product={product} />
              ))}
            </div>
          )}

          {!isLoading && hasSearched && products.length === 0 && (
            <div className="text-center mt-12 text-gray-400">
              <p>No products found. Try a different search term.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
