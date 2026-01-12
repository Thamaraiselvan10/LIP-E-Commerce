import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
    const { items, fetchCart } = useCartStore();
    const navigate = useNavigate();

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

    const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/products?category=boxes', label: 'Boxes' },
        { to: '/products?category=covers', label: 'Covers' },
        { to: '/products?category=tapes', label: 'Tapes' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <header
            role="banner"
            aria-label="Main navigation"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-luxury-900/90 backdrop-blur-md shadow-lg shadow-black/10'
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
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
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
                                className="relative text-gray-600 hover:text-purple-600 font-medium transition-colors group"
                                style={{ padding: '8px 16px' }}
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center" style={{ gap: '12px' }}>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/cart"
                                    className="relative text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
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

                                <div className="flex items-center border-l border-gray-200" style={{ gap: '8px', paddingLeft: '12px' }}>
                                    <Link to="/profile" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors" style={{ gap: '8px' }}>
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                            <User size={18} className="text-purple-600" />
                                        </div>
                                        <span className="font-medium text-sm">{user?.name?.split(' ')[0]}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        style={{ padding: '8px' }}
                                        title="Logout"
                                        aria-label="Logout from your account"
                                    >
                                        <LogOut size={18} aria-hidden="true" />
                                    </button>
                                </div>
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
                        className="lg:hidden text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                        style={{ padding: '8px' }}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-purple-100 animate-slide-up" style={{ padding: '16px 0' }}>
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
        </header>
    );
}
