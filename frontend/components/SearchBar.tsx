'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
        >
            <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl group-focus-within:bg-blue-500/30 transition-all rounded-full opacity-50" />

                <div className="relative flex items-center p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl group-focus-within:border-blue-500/50 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 transition-all">
                    <div className="pl-6 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                        <Search className="w-6 h-6" />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for any product (e.g. iPhone 15, Nike shoes...)"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 px-4 py-4 text-lg outline-none"
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled/cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-95 min-w-[120px] flex items-center justify-center"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>
            </div>

            <div className="flex gap-4 mt-6 justify-center text-sm text-gray-500">
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
