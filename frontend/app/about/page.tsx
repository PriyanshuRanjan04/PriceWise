'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Bell, Heart, Search, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#030712] text-white">
            <Navbar />
            <main className="container mx-auto px-4 pt-24 pb-12">
                {/* Hero */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4"
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span>Support Center</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400"
                    >
                        How can we help you?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        Learn how to get the most out of PriceWise. Track products, compare prices, and save big using our AI-powered tools.
                    </motion.p>
                </div>

                {/* Feature Guides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <FeatureCard
                        icon={<Bell className="w-8 h-8 text-blue-400" />}
                        title="Price Tracking"
                        description="Never pay full price again. Click the 'Track' button on any product card to enable alerts. We'll monitor the price 24/7 and notify you the moment it drops."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Heart className="w-8 h-8 text-red-400" />}
                        title="Saved Items"
                        description="Build your wishlist. Click the heart icon on products you love to save them to your personal collection. Access them anytime from the 'Saved Items' page."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Search className="w-8 h-8 text-purple-400" />}
                        title="AI-Powered Search"
                        description="PriceWise doesn't just search; it understands. Use the search bar to find products across multiple retailers instantly. Sort by price to find the best deals."
                        delay={0.3}
                    />
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FAQItem
                            question="How often are prices updated?"
                            answer="We track prices in real-time. Our system scans major retailers multiple times a day to ensure you always see the most current price available."
                        />
                        <FAQItem
                            question="Is PriceWise completely free?"
                            answer="Yes! PriceWise is 100% free for users. We want to empower you to make smarter shopping decisions without any paywalls."
                        />
                        <FAQItem
                            question="Which stores do you compare?"
                            answer="We currently aggregate prices from major e-commerce platforms like Amazon, Flipkart, and other trusted online retailers."
                        />
                        <FAQItem
                            question="Do I need an account to use PriceWise?"
                            answer="You can search and view products without an account. However, to use advanced features like Price Tracking and Saved Items, you'll need to sign in (it's free!)."
                        />
                    </div>
                </div>

                {/* Trust/Mission */}
                <div className="mt-20 pt-10 border-t border-white/10 text-center">
                    <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-6">
                        <ShieldCheck className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        We believe smart shopping shouldn't be hard. PriceWise was built to bring transparency to e-commerce,
                        helping you cut through the noise and find the true market value of the products you love.
                    </p>
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
            <div className="mb-4 p-3 bg-black/30 rounded-2xl w-fit">{icon}</div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
        </motion.div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-bold pr-8">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {answer}
                </div>
            )}
        </div>
    );
}
