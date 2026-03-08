'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PriceChart from '@/components/PriceChart';
import api from '@/lib/api';
import { Product } from '@/types/product';
import {
    Bell, TrendingDown, Plus, X, Search, Loader2,
    Clock, RefreshCw, Target, ChevronDown, ChevronUp,
    Zap, ShieldCheck, Activity, AlertCircle
} from 'lucide-react';
import { motion as m } from 'framer-motion';
import { useUser, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PricePoint {
    price: string | number;
    timestamp: string;
}

interface TrackedProduct {
    id: string;
    product_id: string;
    title: string;
    price: string;
    source: string;
    link: string;
    thumbnail?: string;
    history: PricePoint[];
    last_updated: string;
    clerk_id?: string;
}

// ─── HOW IT WORKS data ────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
    {
        icon: <Search className="w-6 h-6 text-blue-400" />,
        bg: 'bg-blue-500/10 border-blue-500/20',
        step: '01',
        title: 'Search & Add',
        desc: 'Type any product name. We use Google Shopping (SerpApi) to find it and save its current price as the baseline.',
    },
    {
        icon: <Activity className="w-6 h-6 text-green-400" />,
        bg: 'bg-green-500/10 border-green-500/20',
        step: '02',
        title: 'Auto-Monitoring',
        desc: 'Our APScheduler background job runs every 6 hours, re-fetching prices for all tracked products and logging changes.',
    },
    {
        icon: <Bell className="w-6 h-6 text-orange-400" />,
        bg: 'bg-orange-500/10 border-orange-500/20',
        step: '03',
        title: 'Price Drop Alert',
        desc: 'When a tracked price drops, PriceWise logs the new price to history. You can see the full trend on the chart below.',
    },
    {
        icon: <Target className="w-6 h-6 text-purple-400" />,
        bg: 'bg-purple-500/10 border-purple-500/20',
        step: '04',
        title: 'Buy at the Right Time',
        desc: 'Use the price history chart to decide when to buy. Catch natural price cycles before sales end.',
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrackedCard({
    product,
    onRemove,
}: {
    product: TrackedProduct;
    onRemove: (productId: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [removing, setRemoving] = useState(false);

    const priceNum = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const history = product.history ?? [];
    const priceChange = history.length >= 2
        ? (parseFloat(String(history[history.length - 1].price).replace(/[^0-9.]/g, '')) -
            parseFloat(String(history[0].price).replace(/[^0-9.]/g, '')))
        : 0;
    const priceTrend = priceChange < 0 ? 'down' : priceChange > 0 ? 'up' : 'stable';

    const trendStyles = {
        down: 'text-green-400 bg-green-500/10 border-green-500/20',
        up: 'text-red-400 bg-red-500/10 border-red-500/20',
        stable: 'text-gray-400 bg-white/5 border-white/10',
    };
    const trendLabel = {
        down: `↓ ₹${Math.abs(priceChange).toLocaleString()} cheaper`,
        up: `↑ ₹${Math.abs(priceChange).toLocaleString()} pricier`,
        stable: 'Price stable',
    };

    const handleRemove = async () => {
        setRemoving(true);
        await onRemove(product.product_id);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all"
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    {product.thumbnail && (
                        <div className="w-16 h-16 rounded-2xl bg-white p-2 shrink-0 overflow-hidden">
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base line-clamp-2 text-gray-100 mb-1.5">
                            {product.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                {product.price}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${trendStyles[priceTrend]}`}>
                                {trendLabel[priceTrend]}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500">
                                via {product.source}
                            </span>
                            <span className="text-gray-700">·</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={10} />
                                Updated {new Date(product.last_updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className="text-gray-700">·</span>
                            <span className="text-xs text-gray-500">
                                {history.length} price point{history.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
                            title={expanded ? 'Hide chart' : 'Show price chart'}
                        >
                            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <a
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 text-xs font-bold bg-white text-black rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                        >
                            Buy Now
                        </a>
                        <button
                            onClick={handleRemove}
                            disabled={removing}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20"
                            title="Stop tracking"
                        >
                            {removing ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Price Chart — expandable */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/10"
                    >
                        <div className="p-6 pt-4">
                            <PriceChart
                                history={history}
                                title={product.title.substring(0, 40) + (product.title.length > 40 ? '…' : '')}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrackPage() {
    const { user, isLoaded, isSignedIn } = useUser();

    // Search state
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [addingId, setAddingId] = useState<string | null>(null);
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

    // Tracked products state
    const [tracked, setTracked] = useState<TrackedProduct[]>([]);
    const [trackedLoading, setTrackedLoading] = useState(false);

    // Fetch user's tracked products
    const fetchTracked = useCallback(async () => {
        if (!user) return;
        setTrackedLoading(true);
        try {
            const res = await api.get(`/api/v1/tracker/tracked/${user.id}`);
            setTracked(res.data?.products ?? []);
        } catch (e) {
            console.error('Failed to load tracked products', e);
        } finally {
            setTrackedLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchTracked();
        }
    }, [isLoaded, isSignedIn, fetchTracked]);

    // Search products
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setSearchLoading(true);
        setSearchError('');
        setSearchResults([]);
        try {
            const res = await api.get('/api/v1/products/search', { params: { q: query } });
            setSearchResults(res.data?.results?.slice(0, 6) ?? []);
            if ((res.data?.results ?? []).length === 0) setSearchError('No products found. Try a different query.');
        } catch {
            setSearchError('Search failed. Is the backend running?');
        } finally {
            setSearchLoading(false);
        }
    };

    // Add product to tracker
    const handleAddTracker = async (product: Product) => {
        if (!product.product_id) return;
        setAddingId(product.product_id);
        try {
            await api.post('/api/v1/tracker/track', {
                ...product,
                clerk_id: user?.id,
            });
            setAddedIds((prev) => new Set([...prev, product.product_id!]));
            await fetchTracked();
        } catch (e) {
            console.error('Failed to track product', e);
        } finally {
            setAddingId(null);
        }
    };

    // Remove from tracker
    const handleRemove = async (productId: string) => {
        if (!user) return;
        try {
            await api.delete(`/api/v1/tracker/tracked/${user.id}/${productId}`);
            setTracked((prev) => prev.filter((p) => p.product_id !== productId));
        } catch (e) {
            console.error('Failed to remove tracker', e);
        }
    };

    // ── Auth Guard ──────────────────────────────────────────────────────────────
    if (isLoaded && !isSignedIn) {
        return (
            <div className="min-h-screen bg-[#030712] text-white">
                <Navbar />
                <main className="relative container mx-auto px-4 pt-28 pb-24 flex flex-col items-center justify-center text-center min-h-[80vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md space-y-6"
                    >
                        <div className="inline-flex p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-2">
                            <TrendingDown className="w-12 h-12 text-blue-400" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-black">Track Prices Smarter</h1>
                        <p className="text-gray-400 leading-relaxed">
                            Sign in to start tracking product prices. We'll monitor them
                            every 6 hours and show you the full price history chart.
                        </p>
                        <SignInButton mode="modal">
                            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white text-lg transition-all shadow-xl hover:shadow-blue-500/25 hover:scale-105">
                                Sign in to Start Tracking
                            </button>
                        </SignInButton>
                        <p className="text-gray-600 text-sm">Free forever · No credit card needed</p>
                    </motion.div>
                </main>
            </div>
        );
    }

    // ── Main page ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-green-500/20">
            {/* Ambient blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-green-600/8 blur-[140px] rounded-full" />
                <div className="absolute bottom-[10%] -left-[10%] w-[35%] h-[35%] bg-blue-600/8 blur-[140px] rounded-full" />
            </div>

            <Navbar />

            <main className="relative container mx-auto px-4 pt-28 pb-24 space-y-20">

                {/* ── Hero ──────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest">
                        <Activity className="w-4 h-4" />
                        Price Tracker
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        Watch prices.{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            Buy smarter.
                        </span>
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        Add any product below. PriceWise checks prices every 6 hours using
                        APScheduler and logs every change to the chart.
                    </p>
                </motion.div>

                {/* ── SECTION 1 · Search & Add Tracker ──────────────────────── */}
                <section className="max-w-3xl mx-auto w-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                            <Plus className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black">Search & Add to Tracker</h2>
                            <p className="text-gray-500 text-sm">Search any product — we'll start watching its price</p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., Sony WH-1000XM5 headphones..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/8 transition-all text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={searchLoading || !query.trim()}
                            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                        >
                            {searchLoading
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : <Search className="w-5 h-5" />}
                            Search
                        </button>
                    </form>

                    {/* Results */}
                    <AnimatePresence>
                        {searchError && (
                            <motion.p
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-4 text-sm text-red-400 flex items-center gap-2"
                            >
                                <AlertCircle size={14} /> {searchError}
                            </motion.p>
                        )}

                        {searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 space-y-2"
                            >
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">
                                    {searchResults.length} results — click to add to tracker
                                </p>
                                {searchResults.map((product) => {
                                    const alreadyAdded = addedIds.has(product.product_id ?? '') ||
                                        tracked.some((t) => t.product_id === product.product_id);
                                    return (
                                        <motion.div
                                            key={product.product_id}
                                            layout
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all group"
                                        >
                                            {product.thumbnail && (
                                                <div className="w-12 h-12 rounded-xl bg-white p-1.5 shrink-0">
                                                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm line-clamp-1 text-gray-100">{product.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{product.source} · {product.price}</p>
                                            </div>
                                            <button
                                                onClick={() => !alreadyAdded && handleAddTracker(product)}
                                                disabled={alreadyAdded || addingId === product.product_id}
                                                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${alreadyAdded
                                                    ? 'bg-green-500/15 text-green-400 border border-green-500/20 cursor-default'
                                                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30'
                                                    }`}
                                            >
                                                {addingId === product.product_id
                                                    ? <Loader2 size={12} className="animate-spin" />
                                                    : alreadyAdded
                                                        ? <><ShieldCheck size={12} /> Tracking</>
                                                        : <><Plus size={12} /> Track</>
                                                }
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── SECTION 2 · My Tracked Products ───────────────────────── */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                                <Bell className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black">My Tracked Products</h2>
                                <p className="text-gray-500 text-sm">
                                    {tracked.length > 0
                                        ? `${tracked.length} product${tracked.length !== 1 ? 's' : ''} being monitored`
                                        : 'Nothing tracked yet — add one above'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={fetchTracked}
                            disabled={trackedLoading}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
                        >
                            <RefreshCw size={13} className={trackedLoading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>

                    {trackedLoading ? (
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-28 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
                            ))}
                        </div>
                    ) : tracked.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 bg-white/5 rounded-3xl border border-white/10"
                        >
                            <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
                                <TrendingDown className="w-10 h-10 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">No products tracked yet</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                Search for a product above and click "Track" to start monitoring its price.
                            </p>
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            <div className="space-y-4">
                                {tracked.map((product) => (
                                    <TrackedCard
                                        key={product.product_id}
                                        product={product}
                                        onRemove={handleRemove}
                                    />
                                ))}
                            </div>
                        </AnimatePresence>
                    )}
                </section>

                {/* ── SECTION 3 · How It Works ───────────────────────────────── */}
                <section>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black">How It Works</h2>
                            <p className="text-gray-500 text-sm">Under the hood — no magic, just automation</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {HOW_IT_WORKS.map((item, idx) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                className="relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className={`inline-flex p-3 rounded-2xl border mb-4 ${item.bg}`}>
                                    {item.icon}
                                </div>
                                <div className="absolute top-6 right-6 text-5xl font-black text-white/5 select-none">
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tech callout */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-6 flex flex-wrap items-center gap-3 p-5 rounded-2xl bg-white/3 border border-white/8"
                    >
                        <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                        <p className="text-sm text-gray-400">
                            <span className="text-white font-semibold">Background scheduler:</span>{' '}
                            APScheduler runs <code className="text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded text-xs font-mono">update_all_prices()</code> every{' '}
                            <span className="text-white font-semibold">6 hours</span>, fetching live prices via{' '}
                            <span className="text-white font-semibold">SerpApi → Google Shopping</span>, comparing against stored values, and appending new data points to the MongoDB price history array.
                        </p>
                    </motion.div>
                </section>

            </main>
        </div>
    );
}
