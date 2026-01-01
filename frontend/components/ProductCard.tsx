import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { ExternalLink, Star } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
        >
            <div className="relative h-48 w-full bg-gray-50 p-4">
                <div className="relative h-full w-full">
                    {/* Fallback to simple img if Image optimization is tricky with external urls initially */}
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="object-contain w-full h-full"
                    />
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm border border-gray-200">
                    {product.source}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-gray-800 font-medium line-clamp-2 text-sm min-h-[40px]" title={product.title}>
                    {product.title}
                </h3>

                <div className="mt-3 flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Price</span>
                        <span className="text-xl font-bold text-blue-600">{product.price}</span>
                    </div>
                    {product.rating && (
                        <div className="flex items-center gap-1 text-yellow-500 mb-1">
                            <Star size={14} fill="currentColor" />
                            <span className="text-xs text-gray-600 font-medium">{product.rating}</span>
                        </div>
                    )}
                </div>

                <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                    View Deal <ExternalLink size={16} />
                </a>
            </div>
        </motion.div>
    );
};

export default ProductCard;
