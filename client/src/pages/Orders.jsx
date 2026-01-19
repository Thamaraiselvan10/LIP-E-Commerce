import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Clock, CheckCircle, Truck, XCircle,
    ChevronRight, ShoppingBag, ArrowLeft, Eye,
    Search, Filter, Calendar, MapPin, CreditCard,
    ShieldCheck, Headset, Star
} from 'lucide-react';
import { ordersAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadOrders();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        let filtered = [...orders];
        if (activeFilter !== 'all') {
            filtered = filtered.filter(o => o.status === activeFilter);
        }
        // Simplified time filter logic for demo; in real app we'd use date objects
        if (timeFilter !== 'all') {
            const now = new Date();
            if (timeFilter === 'last30') {
                const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
                filtered = filtered.filter(o => new Date(o.created_at) > thirtyDaysAgo);
            }
        }
        setFilteredOrders(filtered);
    }, [orders, activeFilter, timeFilter]);

    const loadOrders = async () => {
        try {
            const response = await ordersAPI.getMyOrders();
            const data = response.data.orders || [];
            setOrders(data);
            setFilteredOrders(data);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Order Placed', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500', icon: Clock },
            processing: { label: 'Processing', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500', icon: Package },
            shipped: { label: 'Shipped', color: 'text-purple-600', bg: 'bg-purple-50', dot: 'bg-purple-500', icon: Truck },
            delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500', icon: CheckCircle },
            cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', icon: XCircle },
        };
        return statusMap[status] || statusMap.pending;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white" style={{ paddingTop: '80px' }}>
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full"
                    />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Finding your orders...</p>
                </div>
            </div>
        );
    }

    // Detail View Overlay
    if (selectedOrder) {
        const orderStatus = selectedOrder.status;
        const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
        const currentStepIndex = statusSteps.indexOf(orderStatus);

        return (
            <div className="min-h-screen bg-gray-50/30" style={{ paddingTop: '80px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }} className="pb-20">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 font-bold text-gray-900 hover:text-purple-600 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <ArrowLeft size={18} />
                            Back to List
                        </button>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Order ID</span>
                            <span className="bg-white px-4 py-2 rounded-xl text-sm font-black text-gray-900 border border-gray-100">#{selectedOrder.id}</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Tracking Card (Amazon Inspired) */}
                            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                                <h2 className="text-xl font-black mb-8">Order Status</h2>
                                <div className="relative flex justify-between">
                                    {/* Connection Line */}
                                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0" />
                                    <div
                                        className="absolute top-5 left-0 h-1 bg-purple-600 transition-all duration-1000 -z-0"
                                        style={{ width: `${(currentStepIndex / 3) * 100}%` }}
                                    />

                                    {statusSteps.map((step, idx) => {
                                        const info = getStatusInfo(step);
                                        const Icon = info.icon;
                                        const isCompleted = idx <= currentStepIndex;
                                        const isCurrent = idx === currentStepIndex;

                                        return (
                                            <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-[10px] font-black uppercase tracking-tight ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{info.label}</p>
                                                    {isCurrent && <p className="text-[10px] text-purple-600 font-bold mt-0.5">Live</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Items Card */}
                            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                                <h2 className="text-xl font-black mb-6">Ordered Items</h2>
                                <div className="space-y-6">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex gap-6 group">
                                            <div className="w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden border border-gray-50 flex-shrink-0">
                                                <img
                                                    src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`) : 'https://placehold.co/100x100'}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{item.name || item.product_name}</h3>
                                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="text-lg font-black text-gray-900">₹{parseFloat(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                                <div className="mt-3 flex items-center gap-4">
                                                    <button className="text-[10px] font-bold text-purple-600 uppercase tracking-widest hover:underline">Rate Product</button>
                                                    <button className="text-[10px] font-bold text-purple-600 uppercase tracking-widest hover:underline">Need Help?</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="bg-gray-900 text-white rounded-[32px] p-8 shadow-xl shadow-gray-200">
                                <h2 className="text-xl font-black mb-6">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Amount</span>
                                        <span className="font-black text-xl">₹{parseFloat(selectedOrder.total).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Payment</span>
                                        <span className="font-bold text-xs uppercase bg-white/10 px-3 py-1 rounded-lg">{selectedOrder.payment_method || 'COD'}</span>
                                    </div>
                                </div>
                                <button className="w-full mt-8 bg-white text-gray-900 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                                    <Package size={16} />
                                    Download Invoice
                                </button>
                            </div>

                            {/* Shipping info */}
                            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                        <MapPin size={20} />
                                    </div>
                                    <h2 className="text-lg font-black tracking-tight">Delivery Address</h2>
                                </div>
                                {selectedOrder.shipping_details ? (
                                    <div className="space-y-2 text-sm">
                                        <p className="font-black text-gray-900">{selectedOrder.shipping_details.name}</p>
                                        <p className="text-gray-500 font-medium leading-relaxed">{selectedOrder.shipping_details.address}</p>
                                        <p className="text-gray-500 font-medium">{selectedOrder.shipping_details.city}, {selectedOrder.shipping_details.state} - {selectedOrder.shipping_details.pincode}</p>
                                        <div className="pt-4 flex items-center gap-2 text-gray-900 font-black">
                                            <Headset size={14} className="text-purple-600" />
                                            +91 {selectedOrder.shipping_details.phone}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 font-bold italic text-sm">No address details provided.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white" style={{ paddingTop: '80px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900">Your Orders</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Manage your purchases and track status</p>
                </header>

                {orders.length === 0 ? (
                    <div className="text-center py-40">
                        <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag size={40} className="text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4">No Orders Found</h2>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-purple-100 hover:scale-105 active:scale-95 transition-all"
                        >
                            Explore Products
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-4 gap-12 pb-20">
                        {/* Sidebar filters (Flipkart Inspired) */}
                        <aside className="lg:col-span-1 border-r border-gray-100 pr-8 space-y-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 font-mono">Status Filter</h3>
                                <div className="space-y-3">
                                    {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setActiveFilter(status)}
                                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeFilter === status ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            <span className="capitalize">{status}</span>
                                            {activeFilter === status && <CheckCircle size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 font-mono">Order Time</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'all', label: 'All Orders' },
                                        { id: 'last30', label: 'Last 30 Days' },
                                        { id: '2024', label: '2024' },
                                        { id: '2023', label: '2023' }
                                    ].map(time => (
                                        <button
                                            key={time.id}
                                            onClick={() => setTimeFilter(time.id)}
                                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${timeFilter === time.id ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'}`}
                                        >
                                            {time.label}
                                            <Calendar size={14} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* List Column */}
                        <main className="lg:col-span-3 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {filteredOrders.map(order => {
                                    const statusInfo = getStatusInfo(order.status);

                                    return (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            className="group bg-white rounded-[32px] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-purple-500/5 transition-all cursor-pointer flex flex-col md:flex-row gap-8 items-start md:items-center relative"
                                        >
                                            {/* Status Badge Pin */}
                                            <div className="absolute top-8 right-8 flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>{statusInfo.label}</span>
                                            </div>

                                            {/* Preview Image */}
                                            <div className="w-24 h-24 bg-gray-50 rounded-3xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-50">
                                                {order.items && order.items[0] ? (
                                                    <img
                                                        src={order.items[0].image_url ? (order.items[0].image_url.startsWith('http') ? order.items[0].image_url : `${API_URL}${order.items[0].image_url}`) : 'https://placehold.co/100x100'}
                                                        alt="order"
                                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform"
                                                    />
                                                ) : (
                                                    <Package className="text-gray-200" size={32} />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-lg font-black text-gray-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight">
                                                        {order.items && order.items[0] ? (order.items[0].name || order.items[0].product_name) : `Order #${order.id}`}
                                                        {order.items?.length > 1 && <span className="text-gray-400 ml-2 font-bold text-sm">+{order.items.length - 1} more</span>}
                                                    </h3>
                                                    <p className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                                                        <Calendar size={12} />
                                                        Placed on {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 w-full md:w-auto p-4 md:p-0 bg-gray-50 md:bg-transparent rounded-2xl mt-4 md:mt-0">
                                                <div className="text-left md:text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                                    <p className="text-2xl font-black text-gray-900">₹{parseFloat(order.total).toFixed(2)}</p>
                                                </div>
                                                <div className="ml-auto md:ml-0 bg-purple-600 h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-100 transform rotate-12 group-hover:rotate-0 transition-transform group-hover:scale-110">
                                                    <Eye size={24} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </main>
                    </div>
                )}
            </div>
        </div>
    );
}
