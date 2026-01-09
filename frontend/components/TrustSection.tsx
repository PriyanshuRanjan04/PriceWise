'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Bot } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: "No Fake Discounts",
        desc: "We track price history to expose fake 'sales' where prices are hiked before dropping.",
        color: "text-green-400",
        bg: "bg-green-400/10",
        border: "border-green-400/20"
    },
    {
        icon: Zap,
        title: "Real-Time Aggregation",
        desc: "Prices fetch instantly from major retailers. No cached or outdated data.",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20"
    },
    {
        icon: Bot,
        title: "AI Explanations",
        desc: "Our AI analyzes reviews and specs to tell you if it's actually worth your money.",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/20"
    }
];

const TrustSection = () => {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Why Trust <span className="text-blue-500">PriceWise</span>?</h2>
                    <p className="text-gray-400 max-w-xl mx-auto">We don't just show prices. We verify them.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
