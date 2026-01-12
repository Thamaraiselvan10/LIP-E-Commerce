import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, ShoppingBag, ArrowLeft, Eye } from 'lucide-react';
import { ordersAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadOrders();
    }, [isAuthenticated, navigate]);

    const loadOrders = async () => {
        try {
            const response = await ordersAPI.getMyOrders();
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
            processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
            shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
            delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
            cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
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
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '64px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    // Order Detail Modal
    if (selectedOrder) {
        const statusInfo = getStatusInfo(selectedOrder.status);
        const StatusIcon = statusInfo.icon;

        return (
            <div className="flex flex-col bg-gradient-to-b from-purple-50/50 to-white" style={{ minHeight: '100vh', paddingTop: '64px' }}>
                <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
                    {/* Header */}
                    <div className="bg-white border-b border-purple-100 flex-shrink-0" style={{ padding: '16px 24px' }}>
                        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                                    style={{ gap: '8px' }}
                                >
                                    <ArrowLeft size={20} />
                                    <span className="font-medium">Back to Orders</span>
                                </button>
                                <div className={`inline-flex items-center rounded-full text-sm font-medium ${statusInfo.color}`} style={{ gap: '6px', padding: '8px 16px' }}>
                                    <StatusIcon size={16} />
                                    {statusInfo.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
                        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                            {/* Order Header */}
                            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm" style={{ padding: '24px', marginBottom: '24px' }}>
                                <div className="flex flex-wrap items-start justify-between" style={{ gap: '16px' }}>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>
                                            Order #{selectedOrder.id}
                                        </h1>
                                        <p className="text-gray-500">Placed on {formatDate(selectedOrder.created_at)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                            ₹{parseFloat(selectedOrder.total_amount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2" style={{ gap: '24px' }}>
                                {/* Order Items */}
                                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm" style={{ padding: '24px' }}>
                                    <h2 className="text-lg font-bold text-gray-900" style={{ marginBottom: '16px' }}>Order Items</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {selectedOrder.items?.map((item, index) => {
                                            const imageUrl = item.image_url
                                                ? (item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`)
                                                : 'https://placehold.co/80x80/EEE/999?text=No+Image';

                                            return (
                                                <div key={index} className="flex" style={{ gap: '16px' }}>
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-xl bg-purple-50"
                                                        onError={(e) => {
                                                            e.target.src = 'https://placehold.co/80x80/EEE/999?text=No+Image';
                                                        }}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{item.name || item.product_name}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">₹{parseFloat(item.price * item.quantity).toFixed(2)}</p>
                                                        <p className="text-xs text-gray-500">₹{parseFloat(item.price).toFixed(2)} each</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Shipping Details */}
                                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm" style={{ padding: '24px' }}>
                                    <h2 className="text-lg font-bold text-gray-900" style={{ marginBottom: '16px' }}>Shipping Details</h2>
                                    {selectedOrder.shipping_details ? (
                                        <div className="text-gray-600" style={{ lineHeight: '1.8' }}>
                                            <p className="font-medium text-gray-900">{selectedOrder.shipping_details.name}</p>
                                            <p>{selectedOrder.shipping_details.address}</p>
                                            <p>{selectedOrder.shipping_details.city}, {selectedOrder.shipping_details.state} - {selectedOrder.shipping_details.pincode}</p>
                                            <p style={{ marginTop: '8px' }}>Phone: {selectedOrder.shipping_details.phone}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No shipping details available</p>
                                    )}

                                    <div className="border-t border-gray-100" style={{ marginTop: '20px', paddingTop: '20px' }}>
                                        <h3 className="font-semibold text-gray-900" style={{ marginBottom: '8px' }}>Payment Method</h3>
                                        <p className="text-gray-600 capitalize">{selectedOrder.payment_method || 'Cash on Delivery'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Timeline */}
                            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm" style={{ padding: '24px', marginTop: '24px' }}>
                                <h2 className="text-lg font-bold text-gray-900" style={{ marginBottom: '16px' }}>Order Status</h2>
                                <div className="flex items-center justify-between">
                                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                                        const info = getStatusInfo(status);
                                        const Icon = info.icon;
                                        const isActive = ['pending', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status) >= index;
                                        const isCurrent = selectedOrder.status === status;

                                        return (
                                            <div key={status} className="flex flex-col items-center flex-1">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-purple-200' : ''}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <span className={`text-xs font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`} style={{ marginTop: '8px' }}>
                                                    {info.label}
                                                </span>
                                                {index < 3 && (
                                                    <div className={`absolute h-1 w-full ${isActive ? 'bg-purple-600' : 'bg-gray-200'}`} style={{ top: '18px', left: '50%' }}></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Orders List
    return (
        <div className="flex flex-col bg-gradient-to-b from-purple-50/50 to-white" style={{ minHeight: '100vh', paddingTop: '64px' }}>
            <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
                {/* Header */}
                <div className="bg-white border-b border-purple-100 flex-shrink-0" style={{ padding: '16px 24px' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                                <p className="text-gray-500 text-sm">{orders.length} order(s)</p>
                            </div>
                            <Link
                                to="/products"
                                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        {orders.length === 0 ? (
                            <div className="text-center bg-white rounded-2xl border border-purple-100" style={{ padding: '80px 32px' }}>
                                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center" style={{ margin: '0 auto 24px' }}>
                                    <ShoppingBag size={32} className="text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>No orders yet</h3>
                                <p className="text-gray-600" style={{ marginBottom: '24px' }}>Start shopping to see your orders here</p>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg"
                                    style={{ gap: '8px', padding: '14px 28px' }}
                                >
                                    Browse Products
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {orders.map((order) => {
                                    const statusInfo = getStatusInfo(order.status);
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <div
                                            key={order.id}
                                            className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                            style={{ padding: '24px' }}
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <div className="flex flex-wrap items-start justify-between" style={{ gap: '16px' }}>
                                                <div>
                                                    <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
                                                        <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                                                        <span className={`inline-flex items-center rounded-full text-xs font-medium ${statusInfo.color}`} style={{ gap: '4px', padding: '4px 12px' }}>
                                                            <StatusIcon size={12} />
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">Placed on {formatDate(order.created_at)}</p>
                                                    <p className="text-sm text-gray-600" style={{ marginTop: '4px' }}>
                                                        {order.items?.length || 0} item(s)
                                                    </p>
                                                </div>
                                                <div className="flex items-center" style={{ gap: '16px' }}>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">Total</p>
                                                        <p className="text-lg font-bold text-gray-900">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                                                    </div>
                                                    <button className="w-10 h-10 bg-purple-100 hover:bg-purple-200 rounded-xl flex items-center justify-center text-purple-600 transition-colors">
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Quick Items Preview */}
                                            {order.items && order.items.length > 0 && (
                                                <div className="flex items-center border-t border-gray-100" style={{ marginTop: '16px', paddingTop: '16px', gap: '8px' }}>
                                                    {order.items.slice(0, 3).map((item, idx) => {
                                                        const imageUrl = item.image_url
                                                            ? (item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`)
                                                            : 'https://placehold.co/40x40/EEE/999?text=P';

                                                        return (
                                                            <img
                                                                key={idx}
                                                                src={imageUrl}
                                                                alt=""
                                                                className="w-10 h-10 object-cover rounded-lg bg-purple-50"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://placehold.co/40x40/EEE/999?text=P';
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                    {order.items.length > 3 && (
                                                        <span className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-500">
                                                            +{order.items.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
