import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Clock, Package, Users, Activity, TrendingUp, Sparkles, Box } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { Link } from 'react-router-dom';

// Reusable Components
import PageHeader from '../../components/admin/PageHeader';
import StatCard, { StatCardSkeleton } from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import RevenueChart from '../../components/admin/RevenueChart';
import CategoryChart from '../../components/admin/CategoryChart';

// Chart Skeleton
function SkeletonChart() {
    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse">
            <div className="h-6 w-40 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-32 bg-slate-100 rounded mb-6" />
            <div className="h-64 bg-slate-100 rounded-xl" />
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('week');

    // Load dashboard data ONCE on mount - dateFilter only affects charts, not stats
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes] = await Promise.all([
                ordersAPI.getStats(),
                ordersAPI.getAll({ limit: 5 }),
            ]);
            setStats(statsRes.data.stats);
            setRecentOrders(ordersRes.data.orders);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Stat cards configuration - matching reference design
    const statCards = [
        {
            icon: DollarSign,
            label: 'Total Revenue',
            value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
            trend: '+12.5%',
            trendText: 'Since last month',
            trendUp: true,
            color: 'emerald'
        },
        {
            icon: ShoppingCart,
            label: 'Total Orders',
            value: stats.totalOrders,
            trend: '+8.2%',
            trendText: 'Since last week',
            trendUp: true,
            color: 'blue'
        },
        {
            icon: Clock,
            label: 'Pending',
            value: stats.pendingOrders,
            trend: 'Needs attention',
            trendText: '',
            trendUp: false,
            color: 'amber'
        },
        {
            icon: Package,
            label: 'Products',
            value: stats.totalProducts,
            trend: '+5%',
            trendText: 'In stock',
            trendUp: true,
            color: 'purple'
        },
    ];

    // Table columns for Recent Orders
    const orderColumns = [
        {
            key: 'id',
            label: 'Order',
            render: (val) => <span className="font-semibold text-slate-700">#{val}</span>
        },
        {
            key: 'user_name',
            label: 'Customer',
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
                        {val?.[0] || 'G'}
                    </div>
                    <span className="font-medium text-slate-700">{val || 'Guest'}</span>
                </div>
            )
        },
        {
            key: 'total',
            label: 'Total',
            render: (val) => <span className="font-bold text-slate-800">₹{val?.toFixed(2)}</span>
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => {
                const statusStyles = {
                    completed: { background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' },
                    delivered: { background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' },
                    pending: { background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' },
                    processing: { background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe' },
                    shipped: { background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe' },
                    cancelled: { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' },
                    default: { background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe' }
                };
                const style = statusStyles[val] || statusStyles.default;
                return (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        ...style
                    }}>
                        {val}
                    </span>
                );
            }
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Page Header */}
            <PageHeader
                title="Dashboard"
                subtitle="Welcome back! Here's what's happening today."
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading
                    ? [1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)
                    : statCards.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))
                }
            </div>

            {/* Charts Section */}
            <div>
                {/* Section Header with Date Filter */}
                <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                    <h2 className="text-lg font-bold text-slate-800">Analytics Overview</h2>
                    <div className="flex items-center bg-slate-200 rounded-xl" style={{ padding: '6px', gap: '4px' }}>
                        {[
                            { key: 'today', label: 'Today' },
                            { key: 'week', label: 'This Week' },
                            { key: 'month', label: 'This Month' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setDateFilter(key)}
                                style={{ padding: '6px 12px' }}
                                className={`rounded-lg text-sm font-semibold transition-all ${dateFilter === key
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-white hover:text-slate-800'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Charts Grid */}
                {loading ? (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2"><SkeletonChart /></div>
                        <SkeletonChart />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <RevenueChart dateFilter={dateFilter} />
                        </div>
                        <CategoryChart dateFilter={dateFilter} />
                    </div>
                )}
            </div>

            {/* Bottom Section: Recent Orders & Quick Actions */}
            <div className="grid lg:grid-cols-3" style={{ gap: '32px' }}>
                {/* Recent Orders Table */}
                <div className="lg:col-span-2">
                    <DataTable
                        title="Recent Orders"
                        viewAllLink="/admin/orders"
                        columns={orderColumns}
                        data={recentOrders}
                        emptyMessage="No orders to display yet"
                    />
                </div>

                {/* Side Panel - Quick Actions & Store Health */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Quick Actions Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl text-white relative overflow-hidden" style={{ padding: '20px' }}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
                                <Sparkles className="text-amber-400" size={20} />
                                <h3 className="font-bold">Quick Actions</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Link to="/admin/products" className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all" style={{ padding: '12px 16px' }}>
                                    <Box size={18} className="text-purple-300" />
                                    <span className="text-sm font-medium">Add New Product</span>
                                </Link>
                                <Link to="/admin/orders" className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all" style={{ padding: '12px 16px' }}>
                                    <ShoppingCart size={18} className="text-blue-300" />
                                    <span className="text-sm font-medium">Process Orders</span>
                                </Link>
                                <Link to="/admin/announcements" className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all" style={{ padding: '12px 16px' }}>
                                    <TrendingUp size={18} className="text-green-300" />
                                    <span className="text-sm font-medium">Create Promo</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Store Health */}
                    <div className="bg-white rounded-2xl border border-slate-100" style={{ padding: '20px' }}>
                        <h3 className="font-bold text-slate-800" style={{ marginBottom: '9px' }}>Store Health</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <Users size={18} className="text-indigo-600" />
                                    </div>
                                    <span className="text-sm text-slate-600">Customers</span>
                                </div>
                                <span className="font-bold text-slate-800">{stats.totalUsers}</span>
                            </div>

                            <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center">
                                        <Activity size={18} className="text-fuchsia-600" />
                                    </div>
                                    <span className="text-sm text-slate-600">Conversion</span>
                                </div>
                                <span className="font-bold text-slate-800">2.4%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
