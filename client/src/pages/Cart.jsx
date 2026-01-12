import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Shield, Truck, Sparkles } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '64px' }}>
                <div className="text-center">
                    <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center" style={{ margin: '0 auto 24px' }}>
                        <ShoppingBag size={40} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Please login to view your cart</h2>
                    <p className="text-gray-600" style={{ marginBottom: '32px' }}>Sign in to add items and manage your cart</p>
                    <Link to="/login" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg" style={{ gap: '8px', padding: '14px 28px' }}>
                        Sign In
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
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
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '64px' }}>
                <div className="text-center">
                    <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center" style={{ margin: '0 auto 24px' }}>
                        <ShoppingBag size={40} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Your cart is empty</h2>
                    <p className="text-gray-600" style={{ marginBottom: '32px' }}>Start shopping to add items to your cart</p>
                    <Link to="/products" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg" style={{ gap: '8px', padding: '14px 28px' }}>
                        Browse Products
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-gradient-to-b from-purple-50/50 to-white" style={{ minHeight: '100vh', paddingTop: '64px' }}>
            {/* Main Content - Fits Screen */}
            <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
                {/* Header Bar */}
                <div className="bg-white border-b border-purple-100 flex-shrink-0" style={{ padding: '16px 24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                                <p className="text-gray-500 text-sm">{items.length} item(s) in your cart</p>
                            </div>
                            <button
                                onClick={handleClearCart}
                                className="text-red-500 hover:text-red-600 text-sm font-medium hover:bg-red-50 rounded-xl transition-all"
                                style={{ padding: '8px 16px' }}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden" style={{ padding: '24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', height: '100%' }}>
                        <div className="grid lg:grid-cols-3 h-full" style={{ gap: '24px' }}>
                            {/* Cart Items - Scrollable */}
                            <div className="lg:col-span-2 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
                                    {items.map((item) => {
                                        const imageUrl = item.image_url
                                            ? (item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`)
                                            : 'https://placehold.co/100x100/EEE/999?text=No+Image';

                                        return (
                                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-purple-50 hover:shadow-md transition-all flex-shrink-0" style={{ padding: '20px' }}>
                                                <div className="flex" style={{ gap: '16px' }}>
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-xl bg-purple-50 flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.src = 'https://placehold.co/100x100/EEE/999?text=No+Image';
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            to={`/products/${item.product_id}`}
                                                            className="font-bold text-gray-900 hover:text-purple-600 transition-colors truncate block"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent" style={{ marginTop: '4px' }}>
                                                            ₹{item.price?.toFixed(2)}
                                                        </p>

                                                        <div className="flex items-center justify-between" style={{ marginTop: '12px' }}>
                                                            <div className="flex items-center" style={{ gap: '6px' }}>
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={updating === item.id || item.quantity <= 1}
                                                                    className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all"
                                                                >
                                                                    <Minus size={12} />
                                                                </button>
                                                                <span className="w-8 text-center font-bold text-sm">
                                                                    {updating === item.id ? <Loader2 size={12} className="animate-spin" style={{ margin: '0 auto' }} /> : item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                                    disabled={updating === item.id || item.quantity >= item.stock}
                                                                    className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all"
                                                                >
                                                                    <Plus size={12} />
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center" style={{ gap: '12px' }}>
                                                                <span className="font-bold text-gray-900">
                                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleRemove(item.id)}
                                                                    className="text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                    style={{ padding: '6px' }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Summary - Fixed */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg border border-purple-100 h-full flex flex-col" style={{ padding: '24px' }}>
                                    <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '20px' }}>Order Summary</h2>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                        <div className="flex justify-between text-gray-600 text-sm">
                                            <span>Subtotal ({items.length} items)</span>
                                            <span className="font-medium">₹{total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 text-sm">
                                            <span>Shipping</span>
                                            <span className="text-green-600 font-medium">Free</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 text-sm">
                                            <span>GST (18%)</span>
                                            <span className="font-medium">₹{gst.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-purple-100" style={{ paddingTop: '12px' }}>
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total</span>
                                                <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                                    ₹{grandTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Promo Code */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <div className="flex" style={{ gap: '8px' }}>
                                            <input
                                                type="text"
                                                placeholder="Promo code"
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                style={{ padding: '10px 12px' }}
                                            />
                                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all text-sm" style={{ padding: '10px 14px' }}>Apply</button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center"
                                        style={{ padding: '14px', gap: '8px' }}
                                    >
                                        Checkout
                                        <ArrowRight size={18} />
                                    </button>

                                    <Link
                                        to="/products"
                                        className="block text-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                                        style={{ marginTop: '12px' }}
                                    >
                                        Continue Shopping
                                    </Link>

                                    {/* Trust Badges */}
                                    <div className="border-t border-purple-100 mt-auto" style={{ paddingTop: '16px', marginTop: '20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div className="flex items-center text-xs text-gray-500" style={{ gap: '8px' }}>
                                                <Shield size={14} className="text-green-500" />
                                                <span>Secure checkout</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500" style={{ gap: '8px' }}>
                                                <Truck size={14} className="text-purple-500" />
                                                <span>Free shipping above ₹2000</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500" style={{ gap: '8px' }}>
                                                <Sparkles size={14} className="text-amber-500" />
                                                <span>Quality guaranteed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
