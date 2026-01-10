import { useState, useEffect } from 'react';
import { Search, Eye, X, ChevronDown, Package, CreditCard, Truck, User } from 'lucide-react';
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
            await ordersAPI.updateStatus(orderId, newStatus);
            toast.success('Order status updated');
            loadOrders();
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

    // Filter dropdown component
    const FilterDropdown = (
        <div className="relative group">
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-purple-600 transition-colors" />
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none pl-5 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm hover:border-purple-300 transition-all capitalize"
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

            {/* Search Bar */}
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
                        {/* Status Filter Moved Here */}
                        <div className="relative group min-w-[180px]">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                                <ChevronDown size={14} />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="appearance-none w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-purple-300 transition-all capitalize h-[42px]"
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
                                <th style={{ padding: '20px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order Details</th>
                                <th style={{ padding: '20px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th style={{ padding: '20px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th style={{ padding: '20px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th style={{ padding: '20px 24px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th style={{ padding: '20px 24px' }} className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
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
                                    <td style={{ padding: '20px 24px' }}>
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
                                    <td style={{ padding: '20px 24px' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                                {order.user_name?.[0] || 'U'}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{order.user_name || 'Guest'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span className="font-bold text-slate-800">₹{order.total?.toFixed(2)}</span>
                                        <span className="block text-[10px] text-slate-400 font-medium uppercase mt-0.5">{order.payment_method || 'COD'}</span>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div className="relative">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                disabled={updating === order.id}
                                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all uppercase tracking-wide ${getStatusBadge(order.status)}`}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status} className="capitalize bg-white text-slate-800">{status}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }} className="text-sm text-slate-500 font-medium">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '20px 24px' }} className="text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all opacity-0 group-hover:opacity-100"
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
                    <div className="p-16 text-center text-slate-400 bg-slate-50/50">
                        <Search size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium text-slate-600">No orders found</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal - Premium Design */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />

                    <div className="relative bg-slate-100 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
                        {/* Modal Header */}
                        <div className="bg-white border-b border-slate-200 px-10 py-8 flex items-center justify-between shrink-0 z-20 shadow-sm">
                            <div className="flex items-center gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">Order #{selectedOrder.id}</h2>
                                    <p className="text-slate-500 text-base mt-1 font-medium">
                                        Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <span className={`hidden sm:inline-flex px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border shadow-sm ${getStatusBadge(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Update Status */}
                                <div className="relative">
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                                        className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-500/10 hover:border-purple-400 transition-all capitalize shadow-sm"
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status} className="capitalize">{status}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors border border-slate-200 shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10">
                            {/* Customer & Shipping Cards - High Contrast */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                {/* Customer Card */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-400 text-xs uppercase tracking-widest block mb-0.5">Customer Details</span>
                                            <span className="font-bold text-slate-900 text-lg">{selectedOrder.user_name || 'Guest'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Contact Email</label>
                                            <a href={`mailto:${selectedOrder.user_email}`} className="text-base font-medium text-slate-700 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                                                {selectedOrder.user_email}
                                            </a>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">User ID</label>
                                            <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-mono border border-slate-200">
                                                #{selectedOrder.user_id}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Card */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                                            <Truck size={24} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-400 text-xs uppercase tracking-widest block mb-0.5">Shipping To</span>
                                            <span className="font-bold text-slate-900 text-lg">{selectedOrder.shipping_name || selectedOrder.user_name}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Delivery Address</label>
                                            <p className="text-base text-slate-700 leading-relaxed font-medium">
                                                {selectedOrder.shipping_address || 'No address provided'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Region</label>
                                            <p className="text-base text-slate-700 font-medium">
                                                {selectedOrder.shipping_city}, {selectedOrder.shipping_pincode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Section - Explicit Separation */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                            <Package size={20} />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-lg">Order Items <span className="text-slate-400 text-sm ml-1 font-normal">({selectedOrder.items?.length || 0})</span></h3>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-xs text-slate-500 font-bold uppercase tracking-wider bg-slate-50">
                                                <th className="px-8 py-5 font-bold">Product Details</th>
                                                <th className="px-8 py-5 text-center font-bold">Qty</th>
                                                <th className="px-8 py-5 text-right font-bold">Price</th>
                                                <th className="px-8 py-5 text-right font-bold bg-slate-50/50">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedOrder.items?.map((item, i) => (
                                                <tr key={i} className="hover:bg-purple-50/10 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="font-bold text-slate-800 text-base mb-1 group-hover:text-purple-700 transition-colors">{item.name}</div>
                                                        <div className="text-xs text-slate-400 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded border border-slate-200">ID: {item.product_id}</div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm">
                                                            {item.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right text-slate-600 font-medium text-base">₹{item.price.toFixed(2)}</td>
                                                    <td className="px-8 py-6 text-right font-bold text-slate-900 text-base bg-slate-50/30">₹{(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-50 border-t border-slate-200">
                                            <tr>
                                                <td colSpan="3" className="px-8 py-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Subtotal</td>
                                                <td className="px-8 py-6 text-right font-bold text-slate-800 text-lg">₹{selectedOrder.total?.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Explicit Separation */}
                        <div className="bg-white border-t border-slate-200 px-10 py-8 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
                                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-400">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Payment Method</span>
                                        <span className="font-bold text-slate-800 text-sm">{selectedOrder.payment_method || 'Cash On Delivery'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Amount</span>
                                        <span className="text-3xl font-bold text-slate-900 tracking-tight">₹{selectedOrder.total?.toFixed(2)}</span>
                                    </div>
                                    <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 ring-4 ring-slate-100"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
