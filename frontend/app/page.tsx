'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import ChatInterface from '@/components/ChatInterface';
import LiveDemo from '@/components/LiveDemo';
import TrustSection from '@/components/TrustSection';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import TrendingTicker from '@/components/TrendingTicker';
import PopularDeals from '@/components/PopularDeals';
import RecentlySearched from '@/components/RecentlySearched';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { Search, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { user, isSignedIn } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [lastQuery, setLastQuery] = useState('');

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setLastQuery(query);

    // Add to recent searches (prevent duplicates, keep top 5)
    setRecentSearches(prev => {
      const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      return newSearches;
    });

    try {
      // Parallel: Search Products & Save History (if authed)
      const searchPromise = api.get('/api/v1/products/search', {
        params: { q: query }
      });

      const historyPromise = isSignedIn && user ? api.post('/api/v1/user/history', {
        user_id: user.id,
        type: "search",
        query: query,
        timestamp: new Date().toISOString()
      }).catch(e => console.error("Failed to save history", e)) : Promise.resolve();

      const [response] = await Promise.all([searchPromise, historyPromise]);

      if (response.data && response.data.results) {
        setProducts(response.data.results);
      } else {
        setProducts([]);
        console.warn('Empty or unexpected response structure:', response.data);
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-indigo-600/15 blur-[120px] rounded-full animate-bounce" style={{ animationDuration: '10s' }} />
      </div>

      <Navbar />

      <main className="relative container mx-auto px-4 pt-20 pb-24">
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center mb-16 space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Price Intelligence</span>
              </motion.div>

              <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none">
                Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Smarter</span>.
                <br />
                Save <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">Better</span>.
              </h1>

              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Aggregating real-time prices from across the web. Get instant deals,
                price tracking, and AI-driven recommendations in one place.
              </p>

              {/* Ticker */}
              <div className="max-w-3xl mx-auto mt-8">
                <TrendingTicker onSearch={handleSearch} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Section */}
        <div className={`transition-all duration-700 ease-in-out ${hasSearched ? 'mt-0' : 'mt-0'}`}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          {/* Recently Searched */}
          <div className="max-w-3xl mx-auto px-4">
            <RecentlySearched
              searches={recentSearches}
              onSelect={handleSearch}
              onClear={() => setRecentSearches([])}
            />
          </div>
        </div>

        {/* New Components - Shown only on landing (no search) */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <PopularDeals />
            <LiveDemo />
            <TrustSection />
          </motion.div>
        )}

        {/* Results Section */}
        <div className="mt-20">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, idx) => (
                <motion.div
                  key={product.product_id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-red-400 bg-red-400/5 rounded-3xl border border-red-400/10 max-w-2xl mx-auto"
            >
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Search Error</h2>
              <p>{error}</p>
              <button
                onClick={() => handleSearch(lastQuery)}
                className="mt-6 px-6 py-2 bg-red-400/10 hover:bg-red-400/20 rounded-full text-sm font-bold transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {!isLoading && !error && hasSearched && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex p-6 rounded-full bg-white/5 mb-6">
                <Search className="w-12 h-12 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-gray-400">Try a different search term or check your filters.</p>
            </motion.div>
          )}
        </div>
      </main>

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <ChatInterface />
    </div>
  );
}
