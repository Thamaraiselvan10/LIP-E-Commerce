import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, CheckCircle, Loader2, MapPin, Phone, User, ArrowLeft, Shield, Package, Sparkles } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Checkout() {
    const { items, total, fetchCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod',
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [isAuthenticated, navigate, fetchCart]);

    useEffect(() => {
        if (items.length === 0 && step !== 3) {
            navigate('/cart');
        }
    }, [items, step, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, phone, address, city, state, pincode } = formData;
        if (!name || !phone || !address || !city || !state || !pincode) {
            toast.error('Please fill in all shipping details');
            return false;
        }
        if (phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return false;
        }
        if (pincode.length !== 6) {
            toast.error('Please enter a valid 6-digit pincode');
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.product_id,
                    quantity: item.quantity,
                })),
                shippingDetails: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                },
                paymentMethod: formData.paymentMethod,
            };

            await ordersAPI.create(orderData);
            setStep(3);
            toast.success('Order placed successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const gst = total * 0.18;
    const grandTotal = total + gst;

    // Success Screen
    if (step === 3) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '64px' }}>
                <div className="text-center bg-white rounded-3xl shadow-xl shadow-purple-500/5 border border-purple-100" style={{ padding: '48px', maxWidth: '440px', margin: '0 16px' }}>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30" style={{ margin: '0 auto 24px' }}>
                        <CheckCircle className="text-white" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Order Placed!</h2>
                    <p className="text-gray-600 text-sm" style={{ marginBottom: '24px' }}>
                        Thank you for your order. We'll send you an email confirmation shortly.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg"
                            style={{ padding: '14px' }}
                        >
                            View My Orders
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                            style={{ padding: '14px' }}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white" style={{ paddingTop: '80px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header with Progress */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
                    <div>
                        <button
                            onClick={() => step === 1 ? navigate('/cart') : setStep(1)}
                            className="text-gray-400 hover:text-purple-600 font-bold flex items-center gap-2 mb-2 transition-colors uppercase tracking-widest text-xs"
                        >
                            <ArrowLeft size={16} />
                            {step === 1 ? 'Back to Basket' : 'Back to Shipping'}
                        </button>
                        <h1 className="text-4xl font-black text-gray-900">Checkout</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-gray-100 text-gray-400'}`}>
                                1
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-tight ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Shipping</span>
                        </div>
                        <div className="w-12 h-px bg-gray-200" />
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-gray-100 text-gray-400'}`}>
                                2
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-tight ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Payment</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 pb-20">
                    {/* Left: Forms */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-12">
                                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                            <Truck size={24} />
                                        </div>
                                        Shipping Information
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Recipient Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-transparent focus:border-purple-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                                                placeholder="e.g. Rahul Sharma"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Primary Phone</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+91</span>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-50 border border-transparent focus:border-purple-500 focus:bg-white rounded-2xl pl-16 pr-6 py-4 outline-none transition-all font-medium"
                                                    placeholder="98765 43210"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Full Address</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-transparent focus:border-purple-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium resize-none"
                                                rows="3"
                                                placeholder="Flat/House No., Building, Street Name..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-transparent focus:border-purple-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                                                placeholder="Chennai"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-transparent focus:border-purple-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                                                placeholder="Tamil Nadu"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-transparent focus:border-purple-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                                                placeholder="600001"
                                                maxLength="6"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => validateForm() && setStep(2)}
                                        className="w-full mt-12 bg-purple-600 text-white font-black py-5 rounded-2xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        Proceed to Payment
                                        <CreditCard size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-12">
                                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                            <CreditCard size={24} />
                                        </div>
                                        Payment Method
                                    </h2>

                                    <div className="space-y-4">
                                        <label className={`block group relative cursor-pointer`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleChange}
                                                className="peer sr-only"
                                            />
                                            <div className="p-6 rounded-3xl border-2 transition-all peer-checked:border-purple-600 peer-checked:bg-purple-50/50 border-gray-100 bg-white hover:border-purple-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                            <Truck className="text-gray-900" size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">Cash on Delivery</p>
                                                            <p className="text-xs text-gray-500 font-medium">Pay securely at your doorstep</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-6 h-6 rounded-full border-2 border-gray-200 peer-checked:border-purple-600 flex items-center justify-center">
                                                        <div className={`w-3 h-3 rounded-full bg-purple-600 transition-transform ${formData.paymentMethod === 'cod' ? 'scale-100' : 'scale-0'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </label>

                                        <div className="p-6 rounded-3xl border-2 border-dashed border-gray-100 opacity-60 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                    <CreditCard className="text-gray-400" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-400">Online Payment</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Available Soon</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-gray-900">Confirm Shipping Address</h3>
                                            <button onClick={() => setStep(1)} className="text-purple-600 font-bold text-xs uppercase tracking-widest">Edit</button>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1 font-medium">
                                            <p className="font-bold text-gray-900 mb-1">{formData.name}</p>
                                            <p>{formData.address}</p>
                                            <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                                            <p className="pt-2 text-gray-900">+91 {formData.phone}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="w-full mt-12 bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-95 disabled:bg-gray-400 disabled:shadow-none"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>Place My Order — ₹{grandTotal.toFixed(2)}</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Order Summary Sticky */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[32px] border border-gray-100 p-8 sticky" style={{ top: '120px' }}>
                            <h2 className="text-xl font-bold mb-6">Order Detail</h2>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`) : 'https://placehold.co/60x60'}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-gray-900 mt-0.5">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-medium">Subtotal</span>
                                    <span className="text-gray-900 font-bold">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-medium">GST (18%)</span>
                                    <span className="text-gray-900 font-bold">₹{gst.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-medium tracking-tight">Shipping</span>
                                    <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest">Free</span>
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                                    <span className="text-gray-900 font-black uppercase tracking-tight text-xs">Final Amount</span>
                                    <span className="text-3xl font-black text-gray-900">₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Guard Details */}
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Shield size={16} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Secure SSL Transaction</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Package size={16} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Quality Inspected Goods</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
