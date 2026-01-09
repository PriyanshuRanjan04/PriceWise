'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { History, X } from 'lucide-react';

interface RecentlySearchedProps {
    searches: string[];
    onSelect: (term: string) => void;
    onClear: () => void;
}

const RecentlySearched = ({ searches, onSelect, onClear }: RecentlySearchedProps) => {
    if (searches.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none"
        >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
                <History className="w-3.5 h-3.5" />
                Recent
            </div>

            <AnimatePresence>
                {searches.map((term, idx) => (
                    <motion.button
                        key={term}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(term)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${idx === 0
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                            }`}
                    >
                        {term}
                    </motion.button>
                ))}
            </AnimatePresence>

            <button
                onClick={onClear}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-500 transition-colors shrink-0"
                title="Clear History"
            >
                <X size={12} />
            </button>
        </motion.div>
    );
};

export default RecentlySearched;
