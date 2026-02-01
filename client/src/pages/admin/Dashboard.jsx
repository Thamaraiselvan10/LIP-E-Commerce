import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Clock, Package, Users, Activity, TrendingUp, Sparkles, Box } from 'lucide-react';
import { ordersAPI, productsAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import DashboardAlert from '../../components/admin/DashboardAlert';

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
    const [lowStockCount, setLowStockCount] = useState(0);

    // Analytics States
    const [products, setProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);

    // Load dashboard data ONCE on mount - dateFilter only affects charts, not stats
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
                ordersAPI.getStats(),
                ordersAPI.getAll({ limit: 5 }),
                productsAPI.getAllAdmin(),
                productsAPI.getCategoriesList()
            ]);

            setStats(statsRes.data.stats);
            setRecentOrders(ordersRes.data.orders);
            setProducts(productsRes.data.products);

            const categories = categoriesRes.data.categories || [];
            setAllCategories(categories);
            // Default select all categories
            setSelectedCategories(categories.map(c => c.name));

            // Calculate low stock count (threshold < 5)
            const lowStock = productsRes.data.products.filter(p => p.stock < 5).length;
            setLowStockCount(lowStock);

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

            {/* Huge Alert for Low Stock / High Orders */}
            <DashboardAlert
                lowStockCount={lowStockCount}
                pendingOrderCount={stats.pendingOrders > 5 ? stats.pendingOrders : 0}
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
                        <div className="relative">
                            {/* Category Filter Dropdown */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors bg-white border border-slate-100 shadow-sm"
                                    title="Filter Categories"
                                >
                                    <Box size={16} />
                                </button>

                                {showCategoryFilter && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowCategoryFilter(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 p-2 overflow-hidden">
                                            <div className="text-xs font-bold text-slate-500 px-2 py-1 uppercase">Select Categories</div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {allCategories.map(cat => (
                                                    <label key={cat.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(cat.name)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedCategories([...selectedCategories, cat.name]);
                                                                } else {
                                                                    setSelectedCategories(selectedCategories.filter(c => c !== cat.name));
                                                                }
                                                            }}
                                                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <span className="text-sm text-slate-700">{cat.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <CategoryChart
                                data={(() => {
                                    // 1. Filter products by selected categories
                                    const filtered = products.filter(p => selectedCategories.includes(p.category));

                                    // 2. Count occurrences
                                    const counts = {};
                                    filtered.forEach(p => {
                                        const cat = p.category || 'Uncategorized';
                                        counts[cat] = (counts[cat] || 0) + 1;
                                    });

                                    // 3. Format for chart
                                    const colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#fbbf24', '#f59e0b', '#ec4899', '#10b981'];
                                    return Object.keys(counts).map((key, index) => ({
                                        name: key,
                                        value: counts[key],
                                        color: colors[index % colors.length]
                                    }));
                                })()}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Section: Recent Orders & Quick Actions */}
            <div className="grid lg:grid-cols-3" style={{ gap: '22px' }}>
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

                {/* Side Panel - Quick Actions */}
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
                </div>
            </div>
        </div>
    );
}
