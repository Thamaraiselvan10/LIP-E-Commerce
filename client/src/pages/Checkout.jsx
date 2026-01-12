import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, Loader2, MapPin, Phone, User, ArrowLeft, Shield, Package, Sparkles } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

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
        <div className="flex flex-col bg-gradient-to-b from-purple-50/50 to-white" style={{ minHeight: '100vh', paddingTop: '64px' }}>
            {/* Main Content - Fits Screen */}
            <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
                {/* Header Bar */}
                <div className="bg-white border-b border-purple-100 flex-shrink-0" style={{ padding: '12px 24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => step === 1 ? navigate('/cart') : setStep(1)}
                                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                                style={{ gap: '8px' }}
                            >
                                <ArrowLeft size={18} />
                                <span className="font-medium text-sm">{step === 1 ? 'Back to Cart' : 'Back'}</span>
                            </button>

                            {/* Progress Steps */}
                            <div className="flex items-center" style={{ gap: '8px' }}>
                                <div className="flex items-center" style={{ gap: '6px' }}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        <Truck size={14} />
                                    </div>
                                    <span className={`font-medium text-xs hidden sm:block ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Shipping</span>
                                </div>
                                <div className={`w-8 h-0.5 rounded-full ${step >= 2 ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
                                <div className="flex items-center" style={{ gap: '6px' }}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        <CreditCard size={14} />
                                    </div>
                                    <span className={`font-medium text-xs hidden sm:block ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Payment</span>
                                </div>
                            </div>

                            <span className="text-xs text-gray-500">Step {step}/2</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden" style={{ padding: '20px 24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', height: '100%' }}>
                        <div className="grid lg:grid-cols-3 h-full" style={{ gap: '24px' }}>
                            {/* Form - Scrollable */}
                            <div className="lg:col-span-2 flex flex-col overflow-hidden">
                                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 flex-1 overflow-y-auto" style={{ padding: '24px' }}>
                                    {step === 1 && (
                                        <>
                                            <h2 className="text-lg font-bold flex items-center" style={{ marginBottom: '20px', gap: '10px' }}>
                                                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <MapPin className="text-purple-600" size={18} />
                                                </div>
                                                Shipping Details
                                            </h2>
                                            <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-700" style={{ marginBottom: '6px' }}>Full Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                            style={{ padding: '12px 12px 12px 40px' }}
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-700" style={{ marginBottom: '6px' }}>Phone Number</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                            style={{ padding: '12px 12px 12px 40px' }}
                                                            placeholder="+91 98765 43210"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-700" style={{ marginBottom: '6px' }}>Address</label>
                                                    <textarea
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                                                        rows="2"
                                                        style={{ padding: '12px' }}
                                                        placeholder="Street address, building..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700" style={{ marginBottom: '6px' }}>City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                        style={{ padding: '12px' }}
                                                        placeholder="Chennai"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700" style={{ marginBottom: '6px' }}>State</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                        style={{ padding: '12px' }}
                                                        placeholder="Tamil Nadu"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700" style={{ marginBottom: '6px' }}>Pincode</label>
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={formData.pincode}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                        style={{ padding: '12px' }}
                                                        placeholder="600001"
                                                        maxLength="6"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => validateForm() && setStep(2)}
                                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center"
                                                style={{ marginTop: '24px', padding: '14px', gap: '8px' }}
                                            >
                                                Continue to Payment
                                                <CreditCard size={16} />
                                            </button>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <h2 className="text-lg font-bold flex items-center" style={{ marginBottom: '20px', gap: '10px' }}>
                                                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                                                    <CreditCard className="text-amber-600" size={18} />
                                                </div>
                                                Payment Method
                                            </h2>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <label className={`flex items-center border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`} style={{ padding: '16px' }}>
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value="cod"
                                                        checked={formData.paymentMethod === 'cod'}
                                                        onChange={handleChange}
                                                        className="w-4 h-4 text-purple-600"
                                                    />
                                                    <div style={{ marginLeft: '12px', flex: 1 }}>
                                                        <p className="font-semibold text-gray-900 text-sm">Cash on Delivery</p>
                                                        <p className="text-xs text-gray-500">Pay when order arrives</p>
                                                    </div>
                                                    <span className="bg-green-100 text-green-700 text-xs font-bold rounded-lg" style={{ padding: '3px 8px' }}>Available</span>
                                                </label>
                                                <label className="flex items-center border-2 border-gray-200 rounded-xl cursor-not-allowed opacity-60" style={{ padding: '16px' }}>
                                                    <input type="radio" disabled className="w-4 h-4" />
                                                    <div style={{ marginLeft: '12px', flex: 1 }}>
                                                        <p className="font-semibold text-gray-700 text-sm">Online Payment</p>
                                                        <p className="text-xs text-gray-500">UPI, Cards, Net Banking</p>
                                                    </div>
                                                    <span className="bg-gray-100 text-gray-500 text-xs font-bold rounded-lg" style={{ padding: '3px 8px' }}>Soon</span>
                                                </label>
                                            </div>

                                            {/* Shipping Summary */}
                                            <div className="bg-gray-50 rounded-xl border border-gray-200" style={{ marginTop: '20px', padding: '16px' }}>
                                                <h4 className="font-semibold text-gray-800 text-sm" style={{ marginBottom: '8px' }}>Shipping To:</h4>
                                                <p className="text-gray-600 text-sm">{formData.name}</p>
                                                <p className="text-gray-600 text-xs">{formData.address}</p>
                                                <p className="text-gray-600 text-xs">{formData.city}, {formData.state} - {formData.pincode}</p>
                                            </div>

                                            <div className="flex" style={{ gap: '12px', marginTop: '24px' }}>
                                                <button
                                                    onClick={() => setStep(1)}
                                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                                                    style={{ padding: '14px' }}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={handlePlaceOrder}
                                                    disabled={loading}
                                                    className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center"
                                                    style={{ padding: '14px', gap: '8px' }}
                                                >
                                                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                                        <>Place Order<CheckCircle size={16} /></>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Order Summary - Fixed */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg border border-purple-100 h-full flex flex-col" style={{ padding: '20px' }}>
                                    <h2 className="text-lg font-bold text-gray-900" style={{ marginBottom: '16px' }}>Order Summary</h2>

                                    <div className="flex-1 overflow-y-auto" style={{ maxHeight: '150px', marginBottom: '12px' }}>
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 last:border-0" style={{ padding: '10px 0' }}>
                                                <div className="flex items-center" style={{ gap: '10px' }}>
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <Package size={14} className="text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-800 font-medium block text-xs">{item.name}</span>
                                                        <span className="text-gray-500 text-xs">×{item.quantity}</span>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-purple-100" style={{ paddingTop: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div className="flex justify-between text-gray-600 text-sm">
                                                <span>Subtotal</span>
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
                                            <div className="border-t border-purple-100" style={{ paddingTop: '8px', marginTop: '4px' }}>
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total</span>
                                                    <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                                        ₹{grandTotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="border-t border-purple-100 mt-auto" style={{ paddingTop: '12px', marginTop: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div className="flex items-center text-xs text-gray-500" style={{ gap: '6px' }}>
                                                <Shield size={12} className="text-green-500" />
                                                <span>Secure checkout</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500" style={{ gap: '6px' }}>
                                                <Truck size={12} className="text-purple-500" />
                                                <span>Free shipping above ₹2000</span>
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
