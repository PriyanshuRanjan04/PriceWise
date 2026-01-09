'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, MessageSquare, Loader2, ShoppingBag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    relatedProducts?: Product[];
}

const TypingMessage = ({ content }: { content: string }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedContent('');
        setIsComplete(false);
        let i = 0;
        const speed = 15; // ms per char

        const timer = setInterval(() => {
            if (i < content.length) {
                setDisplayedContent(prev => prev + content.charAt(i));
                i++;
            } else {
                setIsComplete(true);
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [content]);

    return (
        <div className="prose prose-invert prose-sm">
            <ReactMarkdown>{displayedContent}</ReactMarkdown>
            {!isComplete && (
                <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse align-middle" />
            )}
        </div>
    );
};

export default function ChatInterface() {
    const { isSignedIn, user } = useUser();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [guestUsageCount, setGuestUsageCount] = useState(0);

    useEffect(() => {
        const storedCount = localStorage.getItem('guest_chat_usage');
        if (storedCount) {
            setGuestUsageCount(parseInt(storedCount));
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isLoading]); // Scroll on new messages or loading state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // Guest Limit Check
        if (!isSignedIn) {
            if (guestUsageCount >= 5) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "🔒 You've reached the free limit. Please **Sign In** to continue using the AI Assistant!"
                }]);
                return;
            }
            const newCount = guestUsageCount + 1;
            setGuestUsageCount(newCount);
            localStorage.setItem('guest_chat_usage', newCount.toString());
        }

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await api.post('/api/v1/chat/', {
                message: userMessage,
                include_search: true,
                user_id: user?.id // Send user ID if signed in
            });

            const data = response.data;

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response,
                relatedProducts: data.results
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg hover:shadow-blue-500/25 transition-all z-50 group"
                    >
                        <MessageSquare className="w-6 h-6" />
                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                            Ask AI Assistant
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-6 right-6 w-[90vw] md:w-[450px] h-[600px] max-h-[80vh] bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">PriceWise AI</h3>
                                    <p className="text-xs text-blue-300">Your shopping assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-20 space-y-2">
                                    <Sparkles className="w-12 h-12 mx-auto text-blue-500/30 mb-4" />
                                    <p>Ask me anything about products!</p>
                                    <p className="text-sm opacity-50">"Best laptops under ₹50,000?"</p>
                                    <p className="text-sm opacity-50">"Compare iPhone 15 vs 14"</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                            : 'bg-white/10 text-gray-200 rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.role === 'user' ? (
                                            <div className="prose prose-invert prose-sm">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            /* Key prop forces re-render of typing effect when content changes (unlikely for history, but good for stream-like feel) */
                                            <TypingMessage key={msg.content} content={msg.content} />
                                        )}
                                    </div>

                                    {/* Related Products Carousel */}
                                    {msg.relatedProducts && msg.relatedProducts.length > 0 && (
                                        <div className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-none snap-x">
                                            {msg.relatedProducts.map((prod, pIdx) => (
                                                <div
                                                    key={pIdx}
                                                    className="min-w-[200px] w-[200px] p-2 bg-white/5 rounded-xl border border-white/10 snap-center flex-shrink-0"
                                                >
                                                    <div className="aspect-video relative rounded-lg overflow-hidden bg-white mb-2">
                                                        <img src={prod.thumbnail} alt={prod.title} className="w-full h-full object-contain" />
                                                    </div>
                                                    <p className="text-xs font-medium text-white truncate">{prod.title}</p>
                                                    <p className="text-sm font-bold text-blue-400">{prod.price}</p>
                                                    <a
                                                        href={prod.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 hover:text-white"
                                                    >
                                                        <ShoppingBag className="w-3 h-3" /> View Deal
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    AI is thinking...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white/5 border-t border-white/10">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for details..."
                                    className="flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
