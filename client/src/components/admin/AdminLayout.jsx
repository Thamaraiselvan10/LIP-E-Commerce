import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Bell,
    LogOut, ChevronRight, Home, Sparkles, ChevronLeft
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function AdminLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuthStore();

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/announcements', icon: Bell, label: 'Announcements' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    // Fixed pixel widths for reliable layout
    const SIDEBAR_EXPANDED = 260;
    const SIDEBAR_COLLAPSED = 72;
    const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Fixed Sidebar */}
            <aside
                style={{ width: `${sidebarWidth}px` }}
                className="fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white shadow-xl transition-[width] duration-300 overflow-hidden"
            >
                {/* Logo */}
                <div className="flex items-center flex-shrink-0 border-b border-white/10" style={{ height: '64px', padding: '0 16px' }}>
                    {!sidebarCollapsed ? (
                        <div className="flex items-center gap-3 w-full">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="font-bold text-base text-white truncate">LIP ADMIN</h1>
                                <p className="text-[9px] text-amber-400 font-medium tracking-widest">PREMIUM</p>
                            </div>
                            <button
                                onClick={() => setSidebarCollapsed(true)}
                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setSidebarCollapsed(false)}
                            className="w-10 h-10 mx-auto rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden" style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {navItems.map((item) => {
                            const active = isActive(item.path, item.exact);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{ height: '44px', padding: sidebarCollapsed ? '0' : '0 14px' }}
                                    className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : ''
                                        } ${active
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                            : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    title={sidebarCollapsed ? item.label : undefined}
                                >
                                    <item.icon size={20} className="flex-shrink-0" />
                                    {!sidebarCollapsed && (
                                        <span className="font-medium text-sm truncate">{item.label}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* User Footer */}
                <div className="flex-shrink-0 border-t border-white/10" style={{ padding: '12px' }}>
                    {!sidebarCollapsed ? (
                        <div className="flex items-center gap-3 rounded-xl bg-white/5" style={{ padding: '12px' }}>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                <span className="font-semibold text-white text-xs">{user?.name?.[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                <p className="text-[10px] text-slate-400">Admin</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 mx-auto rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div
                style={{ marginLeft: `${sidebarWidth}px` }}
                className="flex-1 flex flex-col min-h-screen transition-[margin] duration-300"
            >
                {/* Top Header - With left/right padding */}
                <header className="sticky top-0 z-40 h-14 bg-white border-b border-slate-200 flex items-center justify-between" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold text-slate-800">
                            {navItems.find(item => isActive(item.path, item.exact))?.label || 'Dashboard'}
                        </h2>
                        <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Online
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors flex items-center justify-center relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <Link to="/" className="flex items-center gap-2 h-9 px-4 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                            <Home size={14} />
                            <span className="hidden sm:inline">View Site</span>
                        </Link>
                    </div>
                </header>

                {/* Page Content - WITH padding for gap from sidebar and edges */}
                <main className="flex-1" style={{ padding: '24px 32px 32px 32px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
