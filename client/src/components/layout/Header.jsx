import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Package, Search, Heart, ChevronDown, Edit } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
    const { items, fetchCart } = useCartStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const profileDropdownRef = useRef(null);

    // Check page types
    const isProductsPage = location.pathname === '/products';
    const isProfilePage = location.pathname === '/profile';
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    // Sync search query from URL on Products page
    useEffect(() => {
        if (isProductsPage) {
            setSearchQuery(searchParams.get('search') || '');
        }
    }, [isProductsPage, searchParams]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
        setShowProfileDropdown(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (isProductsPage) {
            // Update URL params on products page
            const params = new URLSearchParams(searchParams);
            if (searchQuery.trim()) {
                params.set('search', searchQuery.trim());
            } else {
                params.delete('search');
            }
            setSearchParams(params);
        } else {
            // Navigate to products with search
            if (searchQuery.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            }
        }
    };

    const handleCategoryClick = (category) => {
        const params = new URLSearchParams(searchParams);
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        // Clear search when changing category
        params.delete('search');
        setSearchQuery('');
        setSearchParams(params);
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/contact', label: 'Contact' },
    ];

    const categoryPills = [
        { key: '', label: 'All Categories' },
        { key: 'boxes', label: 'Boxes' },
        { key: 'covers', label: 'Covers' },
        { key: 'tapes', label: 'Tapes' },
    ];

    const currentCategory = searchParams.get('category') || '';

    const shouldUseDarkText = isScrolled || !isHomePage;
    const textColor = shouldUseDarkText ? 'text-gray-700' : 'text-white';
    const hoverColor = shouldUseDarkText ? 'hover:text-purple-600' : 'hover:text-amber-400';

    // Handle keyboard navigation for dropdown
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowProfileDropdown(false);
        }
    };

    // Enhanced Profile Dropdown Component
    const ProfileDropdown = ({ variant = 'default' }) => {
        const isLight = variant === 'light' || isScrolled || !isHomePage;

        return (
            <div className="relative" ref={profileDropdownRef} onKeyDown={handleKeyDown}>
                {/* Trigger Button */}
                <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className={`flex items-center transition-all rounded-full ${isLight
                        ? 'hover:bg-gray-100'
                        : 'hover:bg-white/10'
                        }`}
                    style={{ padding: '6px 12px 6px 6px', gap: '8px' }}
                    aria-haspopup="true"
                    aria-expanded={showProfileDropdown}
                >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-purple-100 transition-all hover:border-purple-400">
                        {user?.photo_url ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.photo_url}`}
                                alt={user?.name || 'Profile'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={18} className="text-purple-600" />
                        )}
                    </div>
                    {/* Name + Arrow */}
                    <span className={`text-sm font-medium hidden sm:block ${isLight ? 'text-gray-700' : 'text-white'}`}>
                        {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''} ${isLight ? 'text-gray-500' : 'text-white/70'}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                    <>
                        {/* Backdrop for mobile */}
                        <div
                            className="fixed inset-0 z-40 lg:hidden"
                            onClick={() => setShowProfileDropdown(false)}
                        />

                        {/* Dropdown Panel */}
                        <div
                            className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                            style={{
                                animation: 'dropdownFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                transformOrigin: 'top right'
                            }}
                            role="menu"
                        >
                            {/* Arrow Pointer */}
                            <div
                                className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"
                                style={{ zIndex: -1 }}
                            />

                            {/* User Header Section */}
                            <div className="relative bg-gradient-to-br from-purple-50 to-purple-100/50" style={{ padding: '20px' }}>
                                <div className="flex items-center" style={{ gap: '14px' }}>
                                    {/* Large Avatar */}
                                    <div className="w-14 h-14 rounded-full border-3 border-white shadow-lg overflow-hidden flex-shrink-0 bg-purple-200">
                                        {user?.photo_url ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.photo_url}`}
                                                alt={user?.name || 'Profile'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600">
                                                <User size={28} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                {/* Edit Profile */}
                                <Link
                                    to="/profile"
                                    onClick={() => setShowProfileDropdown(false)}
                                    className="flex items-center text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all group"
                                    style={{ padding: '12px 20px', gap: '14px' }}
                                    role="menuitem"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                        <Edit size={18} className="text-gray-500 group-hover:text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-sm font-medium block">Edit Profile</span>
                                        <span className="text-xs text-gray-400">Update your information</span>
                                    </div>
                                </Link>

                                {/* Orders */}
                                <Link
                                    to="/orders"
                                    onClick={() => setShowProfileDropdown(false)}
                                    className="flex items-center text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all group"
                                    style={{ padding: '12px 20px', gap: '14px' }}
                                    role="menuitem"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                        <Package size={18} className="text-gray-500 group-hover:text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-sm font-medium block">My Orders</span>
                                        <span className="text-xs text-gray-400">Track your purchases</span>
                                    </div>
                                </Link>

                                {/* Wishlist */}
                                <Link
                                    to="/wishlist"
                                    onClick={() => setShowProfileDropdown(false)}
                                    className="flex items-center w-full text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all group"
                                    style={{ padding: '12px 20px', gap: '14px' }}
                                    role="menuitem"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                        <Heart size={18} className="text-gray-500 group-hover:text-purple-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <span className="text-sm font-medium block">Wishlist</span>
                                        <span className="text-xs text-gray-400">Your saved items</span>
                                    </div>
                                </Link>

                                {/* Divider */}
                                <div className="border-t border-gray-100" style={{ margin: '8px 20px' }} />

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-red-600 hover:bg-red-50 transition-all group"
                                    style={{ padding: '12px 20px', gap: '14px' }}
                                    role="menuitem"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                        <LogOut size={18} className="text-red-500" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <span className="text-sm font-medium block">Logout</span>
                                        <span className="text-xs text-red-400">Sign out of your account</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* CSS Animation */}
                <style>{`
                    @keyframes dropdownFadeIn {
                        from { 
                            opacity: 0; 
                            transform: scale(0.95) translateY(-8px); 
                        }
                        to { 
                            opacity: 1; 
                            transform: scale(1) translateY(0); 
                        }
                    }
                `}</style>
            </div>
        );
    };

    // Products Page Header
    if (isProductsPage) {
        return (
            <header
                role="banner"
                aria-label="Main navigation"
                className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
            >
                {/* Top Bar */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center group" style={{ gap: '10px' }}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                                <Package className="text-white" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900">
                                    LIP Materials
                                </span>
                                <span className="text-[10px] text-amber-500 font-medium tracking-wider" style={{ marginTop: '-2px' }}>PACKAGING SUPPLIES</span>
                            </div>
                        </Link>

                        {/* Search Bar - Center */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 justify-center" style={{ maxWidth: '400px', margin: '0 40px' }}>
                            <div className="relative w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-700"
                                    style={{ padding: '12px 16px 12px 44px' }}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            const params = new URLSearchParams(searchParams);
                                            params.delete('search');
                                            setSearchParams(params);
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center" style={{ gap: '24px' }}>
                            {isAuthenticated ? (
                                <>
                                    {/* Orders */}
                                    <Link
                                        to="/orders"
                                        className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                                        style={{ gap: '8px' }}
                                    >
                                        <Package size={20} />
                                        <span className="text-sm font-medium">Orders</span>
                                    </Link>

                                    {/* Wishlist */}
                                    <Link
                                        to="/wishlist"
                                        className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                                        style={{ gap: '8px' }}
                                    >
                                        <Heart size={20} />
                                        <span className="text-sm font-medium">Wishlist</span>
                                    </Link>

                                    {/* Cart */}
                                    <Link
                                        to="/cart"
                                        className="relative flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                                        style={{ gap: '8px' }}
                                    >
                                        <div className="relative">
                                            <ShoppingCart size={20} />
                                            {cartItemCount > 0 && (
                                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">Cart</span>
                                    </Link>

                                    {/* Admin Link */}
                                    {isAdmin() && (
                                        <Link
                                            to="/admin"
                                            className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all shadow-lg"
                                            style={{ gap: '6px', padding: '8px 14px' }}
                                        >
                                            <LayoutDashboard size={16} />
                                            <span className="text-sm font-medium">Admin</span>
                                        </Link>
                                    )}

                                    {/* Profile Dropdown */}
                                    <ProfileDropdown />
                                </>
                            ) : (
                                <div className="flex items-center" style={{ gap: '12px' }}>
                                    <Link
                                        to="/login"
                                        className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                                        style={{ padding: '8px 16px' }}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all"
                                        style={{ padding: '10px 20px' }}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                            style={{ padding: '8px' }}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Navigation Bar with Categories */}
                <div className="bg-purple-50 border-t border-purple-100">
                    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                        <div className="flex items-center overflow-x-auto scrollbar-hide" style={{ gap: '8px', padding: '12px 0' }}>
                            {categoryPills.map((pill) => (
                                <button
                                    key={pill.key}
                                    onClick={() => handleCategoryClick(pill.key)}
                                    className={`whitespace-nowrap font-medium transition-all rounded-lg ${currentCategory === pill.key
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
                                        }`}
                                    style={{ padding: '10px 20px' }}
                                >
                                    {pill.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-100" style={{ padding: '16px' }}>
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    style={{ padding: '12px 16px 12px 44px' }}
                                />
                            </div>
                        </form>

                        <nav className="flex flex-col" style={{ gap: '4px' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to + link.label}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl font-medium transition-all"
                                    style={{ padding: '12px 16px' }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/orders"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl flex items-center font-medium"
                                        style={{ padding: '12px 16px', gap: '12px' }}
                                    >
                                        <Package size={18} />
                                        Orders
                                    </Link>
                                    <Link
                                        to="/cart"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl flex items-center font-medium"
                                        style={{ padding: '12px 16px', gap: '12px' }}
                                    >
                                        <ShoppingCart size={18} />
                                        Cart {cartItemCount > 0 && <span className="bg-amber-500 text-white text-xs font-bold rounded-full" style={{ padding: '2px 8px' }}>{cartItemCount}</span>}
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl flex items-center font-medium"
                                        style={{ padding: '12px 16px', gap: '12px' }}
                                    >
                                        <Edit size={18} />
                                        Edit Profile
                                    </Link>
                                    {isAdmin() && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl flex items-center font-medium"
                                            style={{ padding: '12px 16px', gap: '12px' }}
                                        >
                                            <LayoutDashboard size={18} />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 hover:bg-red-50 rounded-xl flex items-center font-medium text-left w-full"
                                        style={{ padding: '12px 16px', gap: '12px' }}
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col border-t border-purple-100" style={{ gap: '8px', paddingTop: '12px', marginTop: '8px' }}>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl font-medium"
                                        style={{ padding: '12px 16px' }}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl text-center"
                                        style={{ margin: '0 16px', padding: '12px' }}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </header>
        );
    }

    // Profile Page Header - Simplified without navigation
    if (isProfilePage) {
        return (
            <header
                role="banner"
                aria-label="Main navigation"
                className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center group" style={{ gap: '10px' }}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                                <Package className="text-white" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900">
                                    LIP Materials
                                </span>
                                <span className="text-[10px] text-amber-500 font-medium tracking-wider" style={{ marginTop: '-2px' }}>PACKAGING SUPPLIES</span>
                            </div>
                        </Link>

                        {/* Right Actions - No navigation links */}
                        <div className="flex items-center" style={{ gap: '16px' }}>
                            {isAuthenticated && (
                                <>
                                    {/* Cart */}
                                    <Link
                                        to="/cart"
                                        className="relative text-gray-600 hover:text-purple-600 transition-colors"
                                        style={{ padding: '8px' }}
                                    >
                                        <ShoppingCart size={22} />
                                        {cartItemCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Profile Dropdown */}
                                    <ProfileDropdown />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    // Default Header (Home and other pages)
    return (
        <header
            role="banner"
            aria-label="Main navigation"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white shadow-md'
                : 'bg-transparent'
                }`}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group" style={{ gap: '10px' }}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                            <Package className="text-white" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-xl font-bold bg-clip-text text-transparent ${shouldUseDarkText ? 'bg-gradient-to-r from-purple-700 to-purple-900' : 'bg-gradient-to-r from-white to-purple-200'}`}>
                                LIP Materials
                            </span>
                            <span className="text-[10px] text-amber-500 font-medium tracking-wider" style={{ marginTop: '-2px' }}>PACKAGING SUPPLIES</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center" style={{ gap: '4px' }} aria-label="Primary navigation">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to + link.label}
                                to={link.to}
                                className={`relative ${textColor} ${hoverColor} font-medium transition-colors group`}
                                style={{ padding: '8px 16px' }}
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center" style={{ gap: '12px' }}>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/cart"
                                    className={`relative ${textColor} ${hoverColor} ${isScrolled ? 'hover:bg-purple-50' : 'hover:bg-white/10'} rounded-xl transition-all`}
                                    style={{ padding: '10px' }}
                                    aria-label={`Shopping cart with ${cartItemCount} items`}
                                >
                                    <ShoppingCart size={22} aria-hidden="true" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg" aria-hidden="true">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>

                                {isAdmin() && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl"
                                        style={{ gap: '8px', padding: '8px 16px' }}
                                    >
                                        <LayoutDashboard size={18} />
                                        <span className="font-medium">Admin</span>
                                    </Link>
                                )}

                                {/* Profile Dropdown */}
                                <ProfileDropdown />
                            </>
                        ) : (
                            <div className="flex items-center" style={{ gap: '12px' }}>
                                <Link
                                    to="/login"
                                    className={`${textColor} ${hoverColor} font-medium transition-colors`}
                                    style={{ padding: '8px 16px' }}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all"
                                    style={{ padding: '10px 20px' }}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`lg:hidden ${textColor} ${hoverColor} ${isScrolled ? 'hover:bg-purple-50' : 'hover:bg-white/10'} rounded-xl transition-all`}
                        style={{ padding: '8px' }}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-purple-100 animate-slide-up bg-white" style={{ padding: '16px 0' }}>
                        <nav className="flex flex-col" style={{ gap: '4px' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to + link.label}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl font-medium transition-all"
                                    style={{ padding: '12px 16px' }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/cart"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl flex items-center font-medium"
                                        style={{ padding: '12px 16px', gap: '12px' }}
                                    >
                                        <ShoppingCart size={18} />
                                        Cart {cartItemCount > 0 && <span className="bg-amber-500 text-white text-xs font-bold rounded-full" style={{ padding: '2px 8px' }}>{cartItemCount}</span>}
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl flex items-center font-medium"
                                        style={{ padding: '12px 16px', gap: '12px' }}
                                    >
                                        <Edit size={18} />
                                        Edit Profile
                                    </Link>
                                    {isAdmin() && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl flex items-center font-medium"
                                            style={{ padding: '12px 16px', gap: '12px' }}
                                        >
                                            <LayoutDashboard size={18} />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 hover:bg-red-50 rounded-xl flex items-center font-medium text-left w-full"
                                        style={{ padding: '12px 16px', gap: '12px' }}
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col border-t border-purple-100" style={{ gap: '8px', paddingTop: '12px', marginTop: '8px' }}>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl font-medium"
                                        style={{ padding: '12px 16px' }}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl text-center"
                                        style={{ margin: '0 16px', padding: '12px' }}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>

            {/* Add CSS animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    );
}
