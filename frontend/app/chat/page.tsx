'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, ShoppingCart, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    results?: any[];
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm PriceWise AI. I can help you find the best deals across the web. What are you looking for today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await api.post('/api/v1/chat/', {
                message: userMessage,
                include_search: true
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.response,
                results: response.data.results
            }]);
        } catch (error) {
            console.error('Chat failed:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white">
            <Navbar />

            <main className="container mx-auto max-w-4xl px-4 pt-28 pb-32">
                <div className="space-y-8">
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {m.role === 'assistant' && (
                                    <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5 text-blue-400" />
                                    </div>
                                )}

                                <div className={`max-w-[80%] space-y-4`}>
                                    <div className={`p-4 rounded-2xl ${m.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white/5 border border-white/10 text-gray-200'
                                        }`}>
                                        <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                            {m.content}
                                        </div>
                                    </div>

                                    {m.results && m.results.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                                        >
                                            {m.results.map((product, idx) => (
                                                <div key={idx} className="scale-90 origin-top-left">
                                                    <ProductCard product={product} />
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>

                                {m.role === 'user' && (
                                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5 text-gray-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center animate-pulse">
                                <Bot className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#030712] via-[#030712] to-transparent">
                <div className="container mx-auto max-w-3xl">
                    <form
                        onSubmit={handleSend}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything... (e.g. 'Best gaming mouse under 2k')"
                            className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-full py-4 pl-6 pr-16 text-white placeholder:text-gray-500 outline-none transition-all backdrop-blur-xl relative"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-2 top-2 bottom-2 px-4 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-gray-500 mt-3 uppercase tracking-widest font-bold opacity-50">
                        Powered by PriceWise AI Orchestration
                    </p>
                </div>
            </div>
        </div>
    );
}
