import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Grid, List, SlidersHorizontal, Package } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

// Animation variants
const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
    }
};

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        sortBy: searchParams.get('sortBy') || 'newest',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
    });

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 300);
        return () => clearTimeout(timer);
    }, [filters.search]);

    // Load products when relevant filters change
    useEffect(() => {
        loadProducts();
    }, [debouncedSearch, filters.category, filters.sortBy, filters.minPrice, filters.maxPrice]);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                search: debouncedSearch,
                category: filters.category,
                sortBy: filters.sortBy,
            };
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;

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

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            // Update URL params
            const params = new URLSearchParams();
            if (newFilters.search) params.set('search', newFilters.search);
            if (newFilters.category) params.set('category', newFilters.category);
            if (newFilters.sortBy && newFilters.sortBy !== 'newest') params.set('sortBy', newFilters.sortBy);
            if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
            if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
            setSearchParams(params);

            return newFilters;
        });
    }, [setSearchParams]);

    const clearFilters = useCallback(() => {
        setFilters({ search: '', category: '', sortBy: 'newest', minPrice: '', maxPrice: '' });
        setSearchParams({});
    }, [setSearchParams]);

    const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice;
    const activeFilterCount = [filters.category, filters.minPrice, filters.maxPrice].filter(Boolean).length;

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A to Z' },
        { value: 'name_desc', label: 'Name: Z to A' },
    ];

    const categoryPills = [
        { key: '', label: 'All Products' },
        { key: 'boxes', label: 'Boxes' },
        { key: 'covers', label: 'Covers' },
        { key: 'tapes', label: 'Tapes' },
    ];

    return (
        <motion.div
            className="min-h-screen bg-gray-50"
            style={{ paddingTop: '80px', paddingBottom: '64px' }}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

                {/* Header Section */}
                <motion.div
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
                    style={{ marginBottom: '24px', paddingTop: '24px' }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <h1 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '4px' }}>
                            Products
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {loading ? 'Loading...' : `Showing ${products.length} products`}
                        </p>
                    </div>

                    {/* Search and Controls */}
                    <div className="flex flex-col sm:flex-row" style={{ gap: '12px' }}>
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full sm:w-64 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                style={{ paddingLeft: '44px', paddingRight: filters.search ? '40px' : '16px', paddingTop: '12px', paddingBottom: '12px' }}
                            />
                            {filters.search && (
                                <button
                                    onClick={() => handleFilterChange('search', '')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="appearance-none w-full sm:w-48 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-gray-700"
                                style={{ padding: '12px 40px 12px 16px' }}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>

                        {/* Filters Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center rounded-xl border transition-all ${showFilters ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                            style={{ padding: '12px', gap: '8px' }}
                        >
                            <SlidersHorizontal size={18} />
                            {activeFilterCount > 0 && (
                                <span className="bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        {/* View Toggle */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                style={{ padding: '12px' }}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                style={{ padding: '12px' }}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm"
                            style={{ padding: '20px', marginBottom: '24px' }}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                        Min Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        style={{ padding: '10px 14px' }}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                        Max Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="10000"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        style={{ padding: '10px 14px' }}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category Filters */}
                <motion.div
                    className="flex flex-wrap items-center"
                    style={{ gap: '8px', marginBottom: '32px' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    {categoryPills.map((pill) => (
                        <button
                            key={pill.key}
                            onClick={() => handleFilterChange('category', pill.key)}
                            className={`font-medium transition-all rounded-lg ${filters.category === pill.key
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                }`}
                            style={{ padding: '10px 20px' }}
                        >
                            {pill.label}
                        </button>
                    ))}

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center text-purple-600 hover:text-purple-700 font-medium transition-all"
                            style={{ gap: '4px', padding: '10px 16px' }}
                        >
                            <X size={16} />
                            Clear All
                        </button>
                    )}
                </motion.div>

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
                        <div className="spinner"></div>
                    </div>
                ) : products.length > 0 ? (
                    <motion.div
                        className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}
                        style={{ gap: '20px' }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        key={`products-${filters.category}-${debouncedSearch}`}
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
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
                        transition={{ duration: 0.4 }}
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center" style={{ margin: '0 auto 20px' }}>
                            <Package size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>No products found</h3>
                        <p className="text-gray-500" style={{ marginBottom: '24px' }}>
                            {hasActiveFilters ? 'Try adjusting your filters' : 'No products available at the moment'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all"
                                style={{ padding: '12px 24px' }}
                            >
                                Clear all filters
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
