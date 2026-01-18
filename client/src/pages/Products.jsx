import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, Package, ChevronRight } from 'lucide-react';
import { productsAPI } from '../services/api';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/products/ProductCard';

// Animation variants
const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.25, ease: 'easeOut' }
    }
};

const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
    }
};

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const { fetchWishlist } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();

    // Get current category from URL
    const currentCategory = searchParams.get('category') || '';
    const currentSearch = searchParams.get('search') || '';
    const currentSortBy = searchParams.get('sortBy') || 'newest';

    // Categories with their display names
    const categories = useMemo(() => [
        { key: '', label: 'All Products' },
        { key: 'boxes', label: 'Boxes' },
        { key: 'covers', label: 'Covers' },
        { key: 'tapes', label: 'Tapes' },
    ], []);

    // Calculate category counts from all products
    const categoryCounts = useMemo(() => {
        const counts = { '': allProducts.length };
        categories.forEach(cat => {
            if (cat.key) {
                counts[cat.key] = allProducts.filter(p => p.category === cat.key).length;
            }
        });
        return counts;
    }, [allProducts, categories]);

    // Load all products once for category counts
    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        }
        const loadAllProducts = async () => {
            try {
                const response = await productsAPI.getAll({});
                setAllProducts(response.data.products || []);
            } catch (err) {
                console.error('Failed to load all products:', err);
            }
        };
        loadAllProducts();
    }, []);

    // Load filtered products when URL params change
    useEffect(() => {
        loadProducts();
    }, [currentCategory, currentSearch, currentSortBy]);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                search: currentSearch,
                category: currentCategory,
                sortBy: currentSortBy,
            };

            const response = await productsAPI.getAll(params);
            setProducts(response.data.products || []);
        } catch (err) {
            console.error('Failed to load products:', err);
            setError('Failed to load products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = useCallback((category) => {
        const params = new URLSearchParams(searchParams);
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        setSearchParams(params);
        setShowMobileSidebar(false);
    }, [searchParams, setSearchParams]);

    const handleSortChange = useCallback((sortBy) => {
        const params = new URLSearchParams(searchParams);
        if (sortBy && sortBy !== 'newest') {
            params.set('sortBy', sortBy);
        } else {
            params.delete('sortBy');
        }
        setSearchParams(params);
    }, [searchParams, setSearchParams]);

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A to Z' },
        { value: 'name_desc', label: 'Name: Z to A' },
    ];

    return (
        <motion.div
            className="min-h-screen bg-gray-50"
            style={{ paddingTop: '140px', paddingBottom: '64px' }}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <div className="flex" style={{ gap: '32px' }}>

                    {/* Sidebar - Categories */}
                    <motion.aside
                        className="hidden lg:block w-64 flex-shrink-0"
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky" style={{ top: '160px', padding: '24px' }}>
                            <h3 className="text-lg font-bold text-gray-900" style={{ marginBottom: '20px' }}>
                                Categories
                            </h3>
                            <nav className="flex flex-col" style={{ gap: '4px' }}>
                                {categories.map((cat) => (
                                    <motion.button
                                        key={cat.key}
                                        onClick={() => handleCategoryChange(cat.key)}
                                        className={`flex items-center justify-between w-full text-left rounded-xl transition-all ${currentCategory === cat.key
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        style={{ padding: '12px 16px' }}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className={`font-medium ${currentCategory === cat.key ? 'text-purple-700' : ''}`}>
                                            {cat.label}
                                        </span>
                                        <span className={`text-sm ${currentCategory === cat.key ? 'text-purple-500' : 'text-gray-400'}`}>
                                            {categoryCounts[cat.key] || 0}
                                        </span>
                                    </motion.button>
                                ))}
                            </nav>
                        </div>
                    </motion.aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header Section */}
                        <motion.div
                            className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
                            style={{ marginBottom: '24px' }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900" style={{ marginBottom: '4px' }}>
                                    {currentCategory
                                        ? categories.find(c => c.key === currentCategory)?.label || 'Products'
                                        : 'All Products'
                                    }
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    {loading ? 'Loading...' : `Showing ${products.length} products`}
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center" style={{ gap: '12px' }}>
                                {/* Mobile Category Toggle */}
                                <button
                                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                                    className="lg:hidden flex items-center bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 transition-all"
                                    style={{ padding: '12px', gap: '8px' }}
                                >
                                    <SlidersHorizontal size={18} />
                                    <span className="text-sm font-medium">Filters</span>
                                </button>

                                {/* Sort Dropdown */}
                                <div className="relative">
                                    <select
                                        value={currentSortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="appearance-none bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-gray-700 text-sm"
                                        style={{ padding: '12px 40px 12px 16px' }}
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className="absolute text-gray-400 pointer-events-none"
                                        size={16}
                                        style={{ right: '16px', top: '50%', transform: 'translateY(-50%)' }}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Mobile Sidebar */}
                        <AnimatePresence>
                            {showMobileSidebar && (
                                <motion.div
                                    className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-sm"
                                    style={{ padding: '20px', marginBottom: '24px' }}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3 className="text-lg font-bold text-gray-900" style={{ marginBottom: '16px' }}>
                                        Categories
                                    </h3>
                                    <div className="flex flex-wrap" style={{ gap: '8px' }}>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.key}
                                                onClick={() => handleCategoryChange(cat.key)}
                                                className={`rounded-xl font-medium transition-all ${currentCategory === cat.key
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                style={{ padding: '10px 16px' }}
                                            >
                                                {cat.label} ({categoryCounts[cat.key] || 0})
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error State */}
                        {error && (
                            <motion.div
                                className="bg-red-50 border border-red-100 rounded-2xl text-center"
                                style={{ padding: '32px', marginBottom: '24px' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className="text-red-600 font-medium">{error}</p>
                                <button
                                    onClick={loadProducts}
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
                                    style={{ padding: '10px 20px' }}
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}

                        {/* Products Grid */}
                        {loading ? (
                            <div className="flex justify-center" style={{ padding: '96px 0' }}>
                                <motion.div
                                    className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                            </div>
                        ) : products.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                style={{ gap: '20px' }}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                key={`products-${currentCategory}-${currentSearch}-${currentSortBy}`}
                            >
                                {products.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        variants={itemVariants}
                                        layout
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                className="text-center bg-white rounded-2xl border border-gray-100"
                                style={{ padding: '96px 32px' }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center" style={{ margin: '0 auto 20px' }}>
                                    <Package size={28} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>No products found</h3>
                                <p className="text-gray-500" style={{ marginBottom: '24px' }}>
                                    {currentCategory ? 'Try selecting a different category' : 'No products available at the moment'}
                                </p>
                                {currentCategory && (
                                    <motion.button
                                        onClick={() => handleCategoryChange('')}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all"
                                        style={{ padding: '12px 24px' }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        View All Products
                                    </motion.button>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div >
        </motion.div >
    );
}
