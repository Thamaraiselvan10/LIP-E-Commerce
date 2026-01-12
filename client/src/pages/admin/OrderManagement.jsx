import { useState, useEffect } from 'react';
import { Search, Eye, X, ChevronDown, Package, CreditCard, User, MapPin } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/PageHeader';
import SearchBar from '../../components/admin/SearchBar';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [filter]);

    const loadOrders = async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await ordersAPI.getAll(params);
            setOrders(response.data.orders);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await ordersAPI.updateStatus(orderId, { status: newStatus });
            toast.success('Order status updated');
            loadOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
            processing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            shipped: 'bg-purple-100 text-purple-700 border-purple-200',
            delivered: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-50 text-red-600 border-red-200',
        };
        return styles[status] || 'bg-slate-100 text-slate-600 border-slate-200';
    };

    const FilterDropdown = (
        <div className="relative group">
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-purple-600 transition-colors" />
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ padding: '12px 48px 12px 20px' }}
                className="appearance-none bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm hover:border-purple-300 transition-all capitalize"
            >
                <option value="all">All Statuses</option>
                {statusOptions.map(status => (
                    <option key={status} value={status} className="capitalize">{status}</option>
                ))}
            </select>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header with Filter */}
            <PageHeader
                title="Orders"
                subtitle="Track and manage your customer orders."
                actions={FilterDropdown}
            />

            {/* Search Bar & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100" style={{ padding: '16px 20px' }}>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
                        <SearchBar
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by order ID, customer..."
                            className="w-full sm:w-80"
                        />
                        {/* Status Filter */}
                        <div className="relative group min-w-[180px]">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                                <ChevronDown size={14} />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                style={{ padding: '10px 36px 10px 16px', height: '42px' }}
                                className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-purple-300 transition-all capitalize"
                            >
                                <option value="all">All Statuses</option>
                                {statusOptions.map(status => (
                                    <option key={status} value={status} className="capitalize">{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-400 whitespace-nowrap">
                        Showing {orders.filter(o => {
                            const matchesSearch = o.id?.toString().includes(search.toLowerCase()) ||
                                o.user_name?.toLowerCase().includes(search.toLowerCase()) ||
                                o.user_email?.toLowerCase().includes(search.toLowerCase());
                            const matchesFilter = filter === 'all' || o.status === filter;
                            return matchesSearch && matchesFilter;
                        }).length} orders
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Table Title */}
                <div className="border-b border-slate-100" style={{ padding: '16px 20px' }}>
                    <h3 className="font-bold text-slate-800">All Orders <span className="text-slate-400 font-normal ml-1">({orders.length})</span></h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th style={{ padding: '12px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order Details</th>
                                <th style={{ padding: '12px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th style={{ padding: '12px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th style={{ padding: '12px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th style={{ padding: '12px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th style={{ padding: '12px 24px' }} className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.filter(o => {
                                const matchesSearch = o.id?.toString().includes(search.toLowerCase()) ||
                                    o.user_name?.toLowerCase().includes(search.toLowerCase()) ||
                                    o.user_email?.toLowerCase().includes(search.toLowerCase());
                                const matchesFilter = filter === 'all' || o.status === filter;
                                return matchesSearch && matchesFilter;
                            }).map((order) => (
                                <tr key={order.id} className="group hover:bg-purple-50/30 transition-colors">
                                    <td style={{ padding: '12px 24px' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <span className="block font-mono text-sm font-bold text-slate-700">#{order.id}</span>
                                                <span className="text-xs text-slate-500">{order.item_count} items</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 24px' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                                {order.user_name?.[0] || 'U'}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{order.user_name || 'Guest'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 24px' }}>
                                        <span className="font-bold text-slate-800">₹{order.total?.toFixed(2)}</span>
                                        <span className="block text-[10px] text-slate-400 font-medium uppercase mt-0.5">{order.payment_method || 'COD'}</span>
                                    </td>
                                    <td style={{ padding: '12px 24px' }}>
                                        <div className="relative inline-block">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                disabled={updating === order.id}
                                                style={{ padding: '8px 32px 8px 12px' }}
                                                className={`appearance-none rounded-lg text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all uppercase tracking-wide ${getStatusBadge(order.status)}`}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status} className="capitalize bg-white text-slate-800">{status}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 24px' }} className="text-sm text-slate-500 font-medium">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '12px 24px' }} className="text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-purple-500 hover:text-purple-700 hover:bg-purple-50 transition-all border border-purple-200"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div style={{ padding: '64px' }} className="text-center text-slate-400 bg-slate-50/50">
                        <Search size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium text-slate-600">No orders found</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />

                    <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200" style={{ padding: '16px 20px' }}>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Order #{selectedOrder.id}</h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span style={{ padding: '8px 16px' }} className={`rounded-lg text-xs font-bold uppercase tracking-wide border ${getStatusBadge(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {/* Status Update */}
                                <div style={{ padding: '12px 16px' }} className="bg-slate-50 rounded-xl border border-slate-100">
                                    <label style={{ marginBottom: '8px' }} className="text-xs font-bold text-slate-500 uppercase tracking-wide block">Update Status</label>
                                    <div className="relative">
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                                            disabled={updating === selectedOrder.id}
                                            style={{ padding: '10px 36px 10px 14px' }}
                                            className="w-full appearance-none bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status} className="capitalize">{status}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Customer & Shipping Info */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                    {/* Customer Info */}
                                    <div style={{ padding: '12px 16px' }} className="bg-slate-50 rounded-xl border border-slate-100">
                                        <div style={{ marginBottom: '8px' }} className="flex items-center gap-2">
                                            <User size={16} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Customer</span>
                                        </div>
                                        <p style={{ marginBottom: '4px' }} className="font-semibold text-slate-800">{selectedOrder.user_name || 'Guest'}</p>
                                        <p className="text-sm text-slate-500">{selectedOrder.user_email}</p>
                                    </div>

                                    {/* Shipping Info */}
                                    <div style={{ padding: '12px 16px' }} className="bg-slate-50 rounded-xl border border-slate-100">
                                        <div style={{ marginBottom: '8px' }} className="flex items-center gap-2">
                                            <MapPin size={16} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Shipping</span>
                                        </div>
                                        <p style={{ marginBottom: '4px' }} className="font-semibold text-slate-800">{selectedOrder.shipping_name || selectedOrder.user_name}</p>
                                        <p className="text-sm text-slate-500">{selectedOrder.shipping_address || 'No address'}</p>
                                        <p className="text-sm text-slate-500">{selectedOrder.shipping_city}, {selectedOrder.shipping_pincode}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 style={{ marginBottom: '8px' }} className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                        Order Items ({selectedOrder.items?.length || 0})
                                    </h3>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                                        {selectedOrder.items?.map((item, i) => (
                                            <div
                                                key={i}
                                                style={{ padding: '12px 14px', borderBottom: i !== selectedOrder.items.length - 1 ? '1px solid #e2e8f0' : 'none' }}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                        <Package size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{item.name}</p>
                                                        <p className="text-xs text-slate-400">Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div style={{ padding: '12px 16px' }} className="bg-slate-50 rounded-xl border border-slate-100">
                                    <div style={{ marginBottom: '8px' }} className="flex items-center gap-2">
                                        <CreditCard size={16} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Payment</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">{selectedOrder.payment_method || 'Cash on Delivery'}</span>
                                        <span className="text-xl font-bold text-slate-900">₹{selectedOrder.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-slate-200" style={{ padding: '12px 20px' }}>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                style={{ padding: '10px' }}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
