import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Shield, Truck, Sparkles } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Animation variants
const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants = {
    initial: { opacity: 0, x: -30, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: 30, scale: 0.95, transition: { duration: 0.3 } }
};

const summaryVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }
};

export default function Cart() {
    const { items, total, isLoading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        setUpdating(itemId);
        const result = await updateQuantity(itemId, newQuantity);
        if (!result.success) {
            toast.error(result.error);
        }
        setUpdating(null);
    };

    const handleRemove = async (itemId) => {
        const result = await removeItem(itemId);
        if (result.success) {
            toast.success('Item removed from cart');
        } else {
            toast.error(result.error);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            const result = await clearCart();
            if (result.success) {
                toast.success('Cart cleared');
            }
        }
    };

    const gst = total * 0.18;
    const grandTotal = total + gst;

    if (!isAuthenticated) {
        return (
            <motion.div
                className="h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white"
                style={{ paddingTop: '64px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="text-center">
                    <motion.div
                        className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center"
                        style={{ margin: '0 auto 24px' }}
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                    >
                        <ShoppingBag size={40} className="text-purple-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Please login to view your cart</h2>
                    <p className="text-gray-600" style={{ marginBottom: '32px' }}>Sign in to add items and manage your cart</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/login" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg" style={{ gap: '8px', padding: '14px 28px' }}>
                            Sign In
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '64px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <motion.div
                className="h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white"
                style={{ paddingTop: '64px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="text-center">
                    <motion.div
                        className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center"
                        style={{ margin: '0 auto 24px' }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ShoppingBag size={40} className="text-purple-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Your cart is empty</h2>
                    <p className="text-gray-600" style={{ marginBottom: '32px' }}>Start shopping to add items to your cart</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/products" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg" style={{ gap: '8px', padding: '14px 28px' }}>
                            Browse Products
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="flex flex-col bg-white"
            style={{ minHeight: '100vh', paddingTop: '80px' }}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight" style={{ marginBottom: '8px' }}>
                        Your Basket
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        {items.length === 0 ? 'Start adding premium supplies' : `You have ${items.length} premium products in your cart`}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3" style={{ gap: '48px', paddingBottom: '100px' }}>
                    {/* Left: Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => {
                                const imageUrl = item.image_url
                                    ? (item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`)
                                    : 'https://placehold.co/120x120/f3f4f6/9ca3af?text=Product';

                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        variants={itemVariants}
                                        className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group"
                                    >
                                        <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <Link to={`/products/${item.product_id}`} className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">
                                                        Category: {item.category || 'General'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                            disabled={updating === item.id || item.quantity <= 1}
                                                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl disabled:opacity-30 transition-all shadow-sm"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="w-12 text-center font-bold text-gray-900">
                                                            {updating === item.id ? <Loader2 size={16} className="animate-spin mx-auto text-purple-600" /> : item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                            disabled={updating === item.id || item.quantity >= (item.stock || 999)}
                                                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl disabled:opacity-30 transition-all shadow-sm"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm text-gray-400 font-medium">Subtotal</p>
                                                    <p className="text-2xl font-black text-gray-900">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {items.length > 0 && (
                            <button
                                onClick={handleClearCart}
                                className="text-gray-400 hover:text-red-500 text-sm font-bold transition-colors flex items-center gap-2"
                                style={{ padding: '8px' }}
                            >
                                <Trash2 size={16} />
                                Empty my basket
                            </button>
                        )}
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-[32px] p-8 text-white sticky" style={{ top: '140px' }}>
                            <h2 className="text-2xl font-bold mb-8">Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-white font-bold">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 font-medium">
                                    <span>GST (18%)</span>
                                    <span className="text-white font-bold">₹{gst.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 font-medium">
                                    <span>Shipping</span>
                                    <div className="flex items-center gap-1.5">
                                        <Truck size={16} className="text-green-400" />
                                        <span className="text-green-400 font-bold uppercase text-xs tracking-widest">Free</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6 mb-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total Pay</span>
                                    <span className="text-4xl font-black text-white">
                                        ₹{grandTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-white text-gray-900 font-black py-5 rounded-2xl hover:bg-purple-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-black/20"
                            >
                                Continue to Checkout
                                <ArrowRight size={20} />
                            </button>

                            {/* Trust Details */}
                            <div className="mt-10 space-y-4 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-purple-400">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Secure Payment</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">SSL Encrypted Transaction</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-400">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Satisfaction Guarantee</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">30-Day Easy Returns</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
