'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product } from '@/types/product';
import {
    Flame, Zap, Timer, Star, TrendingDown, Bell, Cpu, Shirt,
    Footprints, Tv, Loader2, RefreshCw, ChevronRight, Sparkles
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
    id: string;
    label: string;
    icon: React.ReactNode;
    query: string;
    color: string;
    gradient: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEAL_END_TIME = new Date().getTime() + 86400000;

const CATEGORIES: Category[] = [
    {
        id: 'electronics',
        label: 'Electronics',
        icon: <Cpu size={16} />,
        query: 'best deals electronics india',
        color: 'blue',
        gradient: 'from-blue-600 to-indigo-600',
    },
    {
        id: 'fashion',
        label: 'Fashion',
        icon: <Shirt size={16} />,
        query: 'best deals fashion clothing india',
        color: 'purple',
        gradient: 'from-purple-600 to-pink-600',
    },
    {
        id: 'footwear',
        label: 'Footwear',
        icon: <Footprints size={16} />,
        query: 'best deals shoes sneakers india',
        color: 'orange',
        gradient: 'from-orange-500 to-red-500',
    },
    {
        id: 'appliances',
        label: 'Appliances',
        icon: <Tv size={16} />,
        query: 'best deals home appliances india',
        color: 'green',
        gradient: 'from-green-500 to-emerald-600',
    },
];

const FLASH_DEALS = [
    {
        id: 'fd1',
        name: 'Sony WH-1000XM5',
        subtitle: 'Noise Cancelling Headphones',
        price: '₹19,999',
        originalPrice: '₹34,990',
        discount: 43,
        badge: 'FLASH DEAL',
        badgeColor: 'red',
        hoverColor: 'blue',
        img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop',
        imgRotate: '-15deg',
        imgPos: '-right-4 -bottom-4',
        ctaTitle: 'Deal Unlocked!',
        ctaText: 'Valid for next 2 hours only.',
        ctaBtn: 'Claim Offer',
        overlayColor: 'bg-blue-600/95',
    },
    {
        id: 'fd2',
        name: 'MacBook Air M2',
        subtitle: 'Midnight • 256GB SSD',
        price: '₹89,900',
        originalPrice: '₹1,14,900',
        discount: 22,
        badge: 'BEST SELLER',
        badgeColor: 'green',
        hoverColor: 'purple',
        img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=600&auto=format&fit=crop',
        imgRotate: '10deg',
        imgPos: '-right-8 -bottom-8',
        ctaTitle: 'Student Discount',
        ctaText: 'Save extra ₹10,000 with student ID.',
        ctaBtn: 'Verify & Save',
        overlayColor: 'bg-purple-600/95',
    },
    {
        id: 'fd3',
        name: 'Samsung Galaxy S24',
        subtitle: 'Ultra • 256GB • Titanium',
        price: '₹79,999',
        originalPrice: '₹1,24,999',
        discount: 36,
        badge: 'HOT DEAL',
        badgeColor: 'orange',
        hoverColor: 'orange',
        img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600&auto=format&fit=crop',
        imgRotate: '-8deg',
        imgPos: '-right-2 -bottom-2',
        ctaTitle: 'Limited Stock!',
        ctaText: 'Only 6 units left at this price.',
        ctaBtn: 'Grab Now',
        overlayColor: 'bg-orange-600/95',
    },
    {
        id: 'fd4',
        name: 'iPad Air M2',
        subtitle: '11-inch • 128GB • WiFi',
        price: '₹59,900',
        originalPrice: '₹79,900',
        discount: 25,
        badge: 'NEW',
        badgeColor: 'indigo',
        hoverColor: 'indigo',
        img: 'https://images.unsplash.com/photo-1544244015-0df4592c817d?q=80&w=600&auto=format&fit=crop',
        imgRotate: '5deg',
        imgPos: '-right-4 -bottom-4',
        ctaTitle: 'Apple Festival!',
        ctaText: 'Extra cashback on HDFC cards.',
        ctaBtn: 'Shop Now',
        overlayColor: 'bg-indigo-600/95',
    },
];

// ─── Countdown Hook ─────────────────────────────────────────────────────────

function useCountdown(endTime: number) {
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        const tick = () => {
            const dist = endTime - Date.now();
            if (dist <= 0) return;
            setTime({
                hours: Math.floor((dist % 86400000) / 3600000),
                minutes: Math.floor((dist % 3600000) / 60000),
                seconds: Math.floor((dist % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [endTime]);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return { ...time, pad };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle, badge }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    badge?: string;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                    {icon}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black">{title}</h2>
                        {badge && (
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/30">
                                {badge}
                            </span>
                        )}
                    </div>
                    {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}

function ProductSkeleton() {
    return (
        <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden animate-pulse">
            <div className="aspect-square bg-white/5" />
            <div className="p-6 space-y-3">
                <div className="h-4 bg-white/10 rounded-full w-3/4" />
                <div className="h-4 bg-white/10 rounded-full w-1/2" />
                <div className="h-10 bg-white/10 rounded-xl w-full mt-4" />
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealsPage() {
    const { hours, minutes, seconds, pad } = useCountdown(DEAL_END_TIME);

    // Today's picks state
    const [topPicks, setTopPicks] = useState<Product[]>([]);
    const [picksLoading, setPicksLoading] = useState(true);
    const [picksError, setPicksError] = useState(false);

    // Category deals state
    const [activeCategory, setActiveCategory] = useState<string>('electronics');
    const [catProducts, setCatProducts] = useState<Record<string, Product[]>>({});
    const [catLoading, setCatLoading] = useState(false);

    // Fetch Today's Top Picks on mount
    useEffect(() => {
        const fetchPicks = async () => {
            setPicksLoading(true);
            setPicksError(false);
            try {
                const res = await api.get('/api/v1/products/search', {
                    params: { q: 'best deals today india' },
                });
                setTopPicks((res.data?.results ?? []).slice(0, 12));
            } catch {
                setPicksError(true);
            } finally {
                setPicksLoading(false);
            }
        };
        fetchPicks();
    }, []);

    // Fetch category products (cached per tab)
    const fetchCategory = useCallback(async (cat: Category) => {
        if (catProducts[cat.id]) return; // already fetched
        setCatLoading(true);
        try {
            const res = await api.get('/api/v1/products/search', {
                params: { q: cat.query },
            });
            setCatProducts((prev) => ({
                ...prev,
                [cat.id]: (res.data?.results ?? []).slice(0, 8),
            }));
        } catch {
            setCatProducts((prev) => ({ ...prev, [cat.id]: [] }));
        } finally {
            setCatLoading(false);
        }
    }, [catProducts]);

    // Load first category on mount
    useEffect(() => {
        fetchCategory(CATEGORIES[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTabChange = (cat: Category) => {
        setActiveCategory(cat.id);
        fetchCategory(cat);
    };

    const activeCat = CATEGORIES.find((c) => c.id === activeCategory)!;
    const currentCatProducts = catProducts[activeCategory] ?? [];

    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-orange-500/30">
            {/* Ambient background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600/10 blur-[140px] rounded-full" />
                <div className="absolute top-[30%] -right-[10%] w-[35%] h-[35%] bg-red-600/8 blur-[140px] rounded-full" />
                <div className="absolute -bottom-[10%] left-[30%] w-[30%] h-[30%] bg-indigo-600/10 blur-[140px] rounded-full" />
            </div>

            <Navbar />

            <main className="relative container mx-auto px-4 pt-28 pb-24 space-y-20">

                {/* ── Page Hero ──────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
                        <Flame className="w-4 h-4 fill-orange-500" />
                        Today's Hottest Deals
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                        Save{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-500">
                            Big
                        </span>
                        . Shop{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Smart
                        </span>
                        .
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Real-time deals sourced from across the web — curated, compared, and updated live.
                    </p>

                    {/* Global countdown */}
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 font-mono text-sm mt-2">
                        <Timer className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Deals reset in</span>
                        <span className="font-black text-white">
                            {pad(hours)}<span className="text-gray-500 mx-0.5">h</span>
                            {pad(minutes)}<span className="text-gray-500 mx-0.5">m</span>
                            {pad(seconds)}<span className="text-gray-500 mx-0.5">s</span>
                        </span>
                    </div>
                </motion.div>

                {/* ── SECTION 1 · Flash Deals ─────────────────────────────── */}
                <section>
                    <SectionHeader
                        icon={<Zap className="w-5 h-5 text-orange-400 fill-orange-400" />}
                        title="Flash Deals"
                        subtitle="Limited-time offers — prices drop every few hours"
                        badge="Live"
                    />

                    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {FLASH_DEALS.map((deal, idx) => {
                            const badgeStyles: Record<string, string> = {
                                red: 'bg-red-500/20 text-red-400 border-red-500/30',
                                green: 'bg-green-500/20 text-green-400 border-green-500/30',
                                orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                                indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
                            };
                            return (
                                <motion.div
                                    key={deal.id}
                                    whileHover="hover"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.07 }}
                                    className="relative h-[260px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
                                >
                                    {/* Card background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2e] to-[#0f172a] border border-white/10 p-6 flex items-center justify-between">
                                        <div className="z-10 space-y-3 max-w-[55%]">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border ${badgeStyles[deal.badgeColor]}`}>
                                                <Zap size={10} className="fill-current" />
                                                {deal.badge} · {deal.discount}% OFF
                                            </span>
                                            <div>
                                                <h3 className="text-xl font-black leading-tight group-hover:text-blue-300 transition-colors">
                                                    {deal.name}
                                                </h3>
                                                <p className="text-gray-400 text-xs mt-1">{deal.subtitle}</p>
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <span className="text-2xl font-black">{deal.price}</span>
                                                <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                                            </div>
                                        </div>

                                        <motion.img
                                            variants={{ hover: { scale: 1.12, rotate: `-${parseFloat(deal.imgRotate) * 0.3}deg`, x: -6 } }}
                                            transition={{ duration: 0.35 }}
                                            src={deal.img}
                                            alt={deal.name}
                                            className={`w-36 h-36 object-contain drop-shadow-2xl absolute ${deal.imgPos}`}
                                            style={{ rotate: deal.imgRotate }}
                                        />
                                    </div>

                                    {/* Hover CTA overlay */}
                                    <motion.div
                                        initial={{ y: '100%' }}
                                        variants={{ hover: { y: 0 } }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                        className={`absolute inset-0 ${deal.overlayColor} backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-20`}
                                    >
                                        <h4 className="text-xl font-black mb-1">{deal.ctaTitle}</h4>
                                        <p className="text-white/80 mb-5 text-sm">{deal.ctaText}</p>
                                        <button className="bg-white text-black px-7 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl text-sm">
                                            {deal.ctaBtn}
                                        </button>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── SECTION 2 · Today's Top Picks ───────────────────────── */}
                <section>
                    <div className="flex items-start justify-between mb-8">
                        <SectionHeader
                            icon={<Sparkles className="w-5 h-5 text-yellow-400" />}
                            title="Today's Top Picks"
                            subtitle="Best value products fetched live from Google Shopping"
                        />
                        {picksError && (
                            <button
                                onClick={() => {
                                    setPicksError(false);
                                    setPicksLoading(true);
                                    api.get('/api/v1/products/search', { params: { q: 'best deals today india' } })
                                        .then((r) => setTopPicks((r.data?.results ?? []).slice(0, 12)))
                                        .catch(() => setPicksError(true))
                                        .finally(() => setPicksLoading(false));
                                }}
                                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                <RefreshCw size={14} /> Retry
                            </button>
                        )}
                    </div>

                    {picksLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
                        </div>
                    ) : picksError ? (
                        <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-gray-400 mb-4">Couldn't load deals. Backend may be offline.</p>
                            <button
                                onClick={() => {
                                    setPicksError(false);
                                    setPicksLoading(true);
                                    api.get('/api/v1/products/search', { params: { q: 'best deals today india' } })
                                        .then((r) => setTopPicks((r.data?.results ?? []).slice(0, 12)))
                                        .catch(() => setPicksError(true))
                                        .finally(() => setPicksLoading(false));
                                }}
                                className="px-6 py-2.5 bg-orange-500/20 text-orange-400 rounded-full font-bold text-sm border border-orange-500/30 hover:bg-orange-500/30 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : topPicks.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-gray-500">No products returned. Check your SerpApi key.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {topPicks.map((product, idx) => (
                                <motion.div
                                    key={product.product_id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── SECTION 3 · Category-Wise Deals ─────────────────────── */}
                <section>
                    <SectionHeader
                        icon={<Star className="w-5 h-5 text-purple-400 fill-purple-400" />}
                        title="Category Deals"
                        subtitle="Browse the best prices by category"
                    />

                    {/* Tab bar */}
                    <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
                        {CATEGORIES.map((cat) => {
                            const isActive = cat.id === activeCategory;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleTabChange(cat)}
                                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                                        ? 'text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="tab-pill"
                                            className={`absolute inset-0 rounded-xl bg-gradient-to-r ${activeCat.gradient} opacity-90`}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {cat.icon}
                                        {cat.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Category products */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {catLoading && !catProducts[activeCategory] ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
                                </div>
                            ) : currentCatProducts.length === 0 ? (
                                <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                                    <Loader2 className="w-8 h-8 animate-spin text-gray-500 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">Loading {activeCat.label} deals…</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {currentCatProducts.map((product, idx) => (
                                        <motion.div
                                            key={product.product_id || idx}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </section>

                {/* ── SECTION 4 · Price Drop CTA Banner ───────────────────── */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                    >
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/15 to-pink-600/10" />

                        {/* Animated glow orbs */}
                        <div className="absolute top-[-30%] left-[-10%] w-[40%] h-[200%] bg-blue-500/10 blur-[100px] rounded-full" />
                        <div className="absolute top-[-30%] right-[-10%] w-[40%] h-[200%] bg-purple-500/10 blur-[100px] rounded-full" />

                        {/* Floating icons */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[
                                { icon: '₹', top: '15%', left: '5%', delay: 0, color: 'text-blue-400/20' },
                                { icon: '🔔', top: '70%', left: '8%', delay: 1.2, color: '' },
                                { icon: '↓', top: '20%', right: '8%', delay: 0.6, color: 'text-green-400/30' },
                                { icon: '%', top: '65%', right: '5%', delay: 1.8, color: 'text-orange-400/20' },
                                { icon: '💰', top: '45%', left: '15%', delay: 0.9, color: '' },
                                { icon: '📉', top: '40%', right: '15%', delay: 1.5, color: '' },
                            ].map((item, i) => (
                                <motion.span
                                    key={i}
                                    className={`absolute text-2xl opacity-30 select-none ${item.color}`}
                                    style={{ top: item.top, left: (item as any).left, right: (item as any).right }}
                                    animate={{ y: [0, -12, 0] }}
                                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: item.delay }}
                                >
                                    {item.icon}
                                </motion.span>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-14">
                            <div className="text-center md:text-left space-y-4 max-w-lg">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-bold uppercase tracking-widest">
                                    <Bell className="w-3.5 h-3.5" />
                                    Price Drop Alerts
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black leading-tight">
                                    Never miss a{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                        price drop
                                    </span>{' '}
                                    again.
                                </h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Save any product and PriceWise will watch it for you. The moment the price falls,
                                    you'll be the first to know — before stock runs out.
                                </p>

                                <ul className="space-y-2 text-sm text-gray-400">
                                    {[
                                        { icon: '✅', text: 'Track unlimited products' },
                                        { icon: '⚡', text: 'Instant price drop notifications' },
                                        { icon: '📊', text: 'Full price history chart' },
                                    ].map((item) => (
                                        <li key={item.text} className="flex items-center gap-2">
                                            <span>{item.icon}</span>
                                            <span>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col items-center gap-4 shrink-0">
                                {/* Big icon */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-2xl"
                                >
                                    <TrendingDown className="w-16 h-16 text-green-400" strokeWidth={1.5} />
                                </motion.div>

                                <Link
                                    href="/saved"
                                    className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white transition-all duration-200 shadow-xl hover:shadow-blue-500/30 hover:scale-105"
                                >
                                    <Bell className="w-5 h-5" />
                                    Start Tracking Prices
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-gray-500 text-xs text-center">
                                    Free forever · No credit card required
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

            </main>
        </div>
    );
}
