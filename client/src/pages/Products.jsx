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

const CategoryItem = ({ category, currentCategoryId, onCategoryChange, categoryCounts, isMobile = false, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = category.children && category.children.length > 0;
    const isActive = parseInt(currentCategoryId) === category.id;

    const toggleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flex flex-col w-full" style={{ gap: '4px' }}>
            <button
                onClick={() => onCategoryChange(category.id, category.name)}
                className={`flex items-center justify-between w-full text-left rounded-xl transition-all ${isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                style={{ padding: `12px 16px 12px ${16 + level * 16}px` }}
            >
                <div className="flex items-center" style={{ gap: '8px' }}>
                    {hasChildren && (
                        <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            onClick={toggleExpand}
                            className="p-1 hover:bg-black/5 rounded-md transition-colors"
                        >
                            <ChevronRight size={14} />
                        </motion.div>
                    )}
                    <span className="font-semibold text-sm">{category.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {categoryCounts[category.id] || 0}
                </span>
            </button>

            {hasChildren && isExpanded && (
                <div className="flex flex-col" style={{ gap: '4px' }}>
                    {category.children.map((child) => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            currentCategoryId={currentCategoryId}
                            onCategoryChange={onCategoryChange}
                            categoryCounts={categoryCounts}
                            isMobile={isMobile}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const { fetchWishlist } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();

    // Get current category from URL
    const currentCategoryId = searchParams.get('categoryId') || '';
    const currentCategory = searchParams.get('category') || '';
    const currentSearch = searchParams.get('search') || '';
    const currentSortBy = searchParams.get('sortBy') || 'newest';

    // Calculate category counts from all products
    const categoryCounts = useMemo(() => {
        const counts = {};

        // 1. Get direct counts for all categories
        const directCounts = {};
        allProducts.forEach(p => {
            if (p.category_id) {
                directCounts[p.category_id] = (directCounts[p.category_id] || 0) + 1;
            }
        });

        // 2. Recursive function to aggregate child counts into parents
        const getAggregateCount = (cat) => {
            let total = directCounts[cat.id] || 0;
            if (cat.children && cat.children.length > 0) {
                cat.children.forEach(child => {
                    total += getAggregateCount(child);
                });
            }
            counts[cat.id] = total;
            return total;
        };

        categories.forEach(cat => getAggregateCount(cat));

        counts[''] = allProducts.length; // Total count
        return counts;
    }, [allProducts, categories]);

    // Load all products once for category counts
    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        }
        const loadInitialData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productsAPI.getAll({}),
                    productsAPI.getCategoriesList()
                ]);
                setAllProducts(productsRes.data.products || []);
                setCategories(categoriesRes.data.categories || []);
            } catch (err) {
                console.error('Failed to load initial data:', err);
            }
        };
        loadInitialData();
    }, []);

    // Load filtered products when URL params change
    useEffect(() => {
        loadProducts();
    }, [currentCategory, currentCategoryId, currentSearch, currentSortBy]);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                search: currentSearch,
                category: currentCategory,
                categoryId: currentCategoryId,
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

    const handleCategoryChange = useCallback((categoryId, label) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId) {
            params.set('categoryId', categoryId);
            params.set('category', label);
        } else {
            params.delete('categoryId');
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
                <div className="flex flex-col lg:flex-row" style={{ gap: '40px' }}>

                    {/* Sidebar - Categories & Filters */}
                    <motion.aside
                        className="hidden lg:block w-72 flex-shrink-0"
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky" style={{ top: '160px', padding: '28px' }}>
                            <div className="flex items-center" style={{ gap: '10px', marginBottom: '24px' }}>
                                <SlidersHorizontal size={20} className="text-purple-600" />
                                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider" style={{ marginBottom: '16px', fontSize: '11px' }}>
                                    Categories
                                </h4>
                                <nav className="flex flex-col" style={{ gap: '6px' }}>
                                    <button
                                        onClick={() => handleCategoryChange('', '')}
                                        className={`flex items-center justify-between w-full text-left rounded-xl transition-all ${!currentCategoryId
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                            : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                                            }`}
                                        style={{ padding: '12px 16px', marginBottom: '8px' }}
                                    >
                                        <span className="font-semibold text-sm">All Products</span>
                                        <span className={`text-xs px-2 py-1 rounded-lg ${!currentCategoryId ? 'bg-white/20' : 'bg-gray-100'}`}>
                                            {allProducts.length}
                                        </span>
                                    </button>

                                    {categories
                                        .filter(cat => !cat.parent_id) // Only root level
                                        .sort((a, b) => a.id - b.id)  // Preserve desired order (1-5)
                                        .map((cat) => (
                                            <CategoryItem
                                                key={cat.id}
                                                category={cat}
                                                currentCategoryId={currentCategoryId}
                                                onCategoryChange={handleCategoryChange}
                                                categoryCounts={categoryCounts}
                                            />
                                        ))}
                                </nav>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider" style={{ marginBottom: '16px', fontSize: '11px' }}>
                                    Availability
                                </h4>
                                <div className="space-y-3">
                                    <label className="flex items-center cursor-pointer group" style={{ gap: '10px' }}>
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">In Stock</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group" style={{ gap: '10px' }}>
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">On Sale</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between" style={{ marginBottom: '32px', gap: '20px' }}>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ marginBottom: '4px' }}>
                                    {currentCategory ? currentCategory : 'All Collection'}
                                </h1>
                                <p className="text-gray-500 font-medium">
                                    {loading ? 'Discovering products...' : `Explore ${products.length} premium packaging solutions`}
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center" style={{ gap: '16px' }}>
                                {/* Mobile Category Toggle */}
                                <button
                                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                                    className="lg:hidden flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-2xl text-gray-700 shadow-sm transition-all"
                                    style={{ padding: '12px 20px', gap: '8px' }}
                                >
                                    <SlidersHorizontal size={18} />
                                    <span className="text-sm font-bold">Filters</span>
                                </button>

                                {/* Sort Dropdown */}
                                <div className="relative flex-1 lg:flex-none">
                                    <select
                                        value={currentSortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="w-full appearance-none bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 cursor-pointer text-gray-700 text-sm font-bold shadow-sm"
                                        style={{ padding: '12px 48px 12px 20px' }}
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className="absolute text-gray-400 pointer-events-none"
                                        size={18}
                                        style={{ right: '16px', top: '50%', transform: 'translateY(-50%)' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Sidebar */}
                        <AnimatePresence>
                            {showMobileSidebar && (
                                <motion.div
                                    className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
                                    style={{ padding: '24px', marginBottom: '32px' }}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <h3 className="text-lg font-bold text-gray-900" style={{ marginBottom: '20px' }}>
                                        Categories
                                    </h3>
                                    <div className="flex flex-col" style={{ gap: '6px' }}>
                                        <button
                                            onClick={() => handleCategoryChange('', '')}
                                            className={`rounded-xl font-bold transition-all text-left ${!currentCategoryId
                                                ? 'bg-purple-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                            style={{ padding: '12px 20px', fontSize: '13px' }}
                                        >
                                            All Products
                                        </button>
                                        {categories
                                            .filter(cat => !cat.parent_id)
                                            .sort((a, b) => a.id - b.id)
                                            .map((cat) => (
                                                <CategoryItem
                                                    key={cat.id}
                                                    category={cat}
                                                    currentCategoryId={currentCategoryId}
                                                    onCategoryChange={handleCategoryChange}
                                                    categoryCounts={categoryCounts}
                                                    isMobile
                                                />
                                            ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Results Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr" style={{ gap: '24px' }}>
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl aspect-[4/5] border border-gray-100 animate-pulse" />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
                                style={{ gap: '24px' }}
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
                                className="text-center bg-white rounded-3xl border border-gray-100 shadow-sm"
                                style={{ padding: '100px 32px' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center" style={{ margin: '0 auto 28px' }}>
                                    <Package size={40} className="text-purple-200" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '12px' }}>No matches found</h3>
                                <p className="text-gray-500 text-lg" style={{ marginBottom: '32px' }}>
                                    We couldn't find any products in this category at the moment.
                                </p>
                                <button
                                    onClick={() => handleCategoryChange('')}
                                    className="bg-gray-900 text-white font-bold rounded-2xl transition-all hover:bg-black active:scale-95"
                                    style={{ padding: '16px 32px' }}
                                >
                                    Browse all collection
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div >
        </motion.div >
    );
}
