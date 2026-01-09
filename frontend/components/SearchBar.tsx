'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

const PLACEHOLDERS = [
    "Search for 'iPhone 15'...",
    "Search for 'Nike Air Jordan'...",
    "Search for 'Sony Headphones'...",
    "Search for 'Gaming Laptops'..."
];

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
    const [query, setQuery] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    // Typing Animation Effect
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const currentText = PLACEHOLDERS[placeholderIndex];

        if (isTyping) {
            if (displayedPlaceholder.length < currentText.length) {
                timeout = setTimeout(() => {
                    setDisplayedPlaceholder(currentText.slice(0, displayedPlaceholder.length + 1));
                }, 50);
            } else {
                timeout = setTimeout(() => setIsTyping(false), 2000);
            }
        } else {
            if (displayedPlaceholder.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayedPlaceholder(displayedPlaceholder.slice(0, -1));
                }, 30);
            } else {
                setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedPlaceholder, isTyping, placeholderIndex]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto relative z-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
        >
            <motion.div
                className="relative group"
                animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Glow Effect */}
                <motion.div
                    className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0"
                    animate={{ opacity: isFocused ? 0.6 : 0.2 }}
                    transition={{ duration: 0.5 }}
                />

                <div
                    className={`relative flex items-center p-2 rounded-full bg-white/5 border backdrop-blur-xl transition-all duration-300 ${isFocused ? 'border-blue-500/50 ring-4 ring-blue-500/10 bg-white/10' : 'border-white/10'}`}
                >
                    <div className={`pl-6 transition-colors ${isFocused ? 'text-blue-400' : 'text-gray-400'}`}>
                        <Search className="w-6 h-6" />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={displayedPlaceholder}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500/50 px-4 py-4 text-lg outline-none w-full"
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-95 min-w-[120px] flex items-center justify-center relative overflow-hidden group/btn"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Search</span>
                                {query.trim() && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 'auto', opacity: 1 }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </button>
                </div>
            </motion.div>

            <div className="flex gap-4 mt-6 justify-center text-sm text-gray-500 flex-wrap">
                <span>Popular:</span>
                {['iPhone 15', 'OnePlus 12', 'Noise Smartwatch'].map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => { setQuery(tag); onSearch(tag); }}
                        className="hover:text-blue-400 transition-colors"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </motion.form>
    );
};

export default SearchBar;
