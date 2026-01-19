import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Check, ShieldCheck, Truck, RotateCcw, Plus, Minus, Info } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function QuickViewModal({ product, isOpen, onClose }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCartStore();
    const { isAuthenticated, isAdmin } = useAuthStore();

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast('Please login to continue', { icon: '🔐' });
            return;
        }
        if (isAdmin()) {
            toast.error('Admins cannot purchase');
            return;
        }

        const result = await addToCart(product.id, quantity);
        if (result.success) {
            toast.success('Added to cart!');
            onClose();
        }
    };

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`)
        : 'https://placehold.co/600x600/f8f8f8/999?text=No+Image';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Left: Product Image */}
                    <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-12">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain max-h-[400px]"
                        />
                    </div>

                    {/* Right: Info */}
                    <div className="w-full md:w-1/2 p-10 flex flex-col">
                        <div className="mb-4">
                            <span className="bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                {product.category || 'General'}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {product.name}
                        </h2>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gray-900">4.0</span>
                            <span className="text-gray-300 text-xs">|</span>
                            <span className="text-xs text-gray-500">128 reviews</span>
                        </div>

                        <div className="mb-6">
                            <span className="text-3xl font-extrabold text-gray-900">
                                ₹{product.price?.toFixed(2)}
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-3">
                            {product.description || 'Premium quality packaging solution for your business needs.'}
                        </p>

                        <div className="mt-auto space-y-6">
                            {/* Stock Info */}
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Quantity and Action */}
                            {product.stock > 0 && !isAdmin() && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden p-1 bg-gray-50">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-30"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-30"
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </button>
                                </div>
                            )}

                            {/* Quick Links */}
                            <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                                <div className="flex flex-col items-center">
                                    <Truck size={18} className="text-purple-600 mb-1" />
                                    <span className="text-[10px] text-gray-500">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <ShieldCheck size={18} className="text-purple-600 mb-1" />
                                    <span className="text-[10px] text-gray-500">Secure</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <RotateCcw size={18} className="text-purple-600 mb-1" />
                                    <span className="text-[10px] text-gray-500">30 Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

