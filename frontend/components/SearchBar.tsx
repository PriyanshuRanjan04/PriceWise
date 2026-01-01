'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
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
            className="relative w-full max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
        >
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products (e.g., iPhone 15 Pro, Nike Air Max)..."
                    className="w-full px-6 py-4 pl-14 text-lg bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-800 group-hover:shadow-md"
                    disabled={isLoading}
                />
                <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
                    size={24}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </motion.form>
    );
};

export default SearchBar;
