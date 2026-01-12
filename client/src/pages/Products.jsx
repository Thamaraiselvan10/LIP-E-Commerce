import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, Grid, List, Package } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        sortBy: searchParams.get('sortBy') || 'newest',
    });

    // Category display info
    const categoryInfo = {
        boxes: { name: 'Cardboard Boxes', icon: '📦', color: 'from-purple-500 to-indigo-600', desc: 'Various sizes for shipping & storage' },
        covers: { name: 'Courier Covers', icon: '📮', color: 'from-amber-400 to-yellow-500', desc: 'Amazon, Flipkart, Meesho & more' },
        tapes: { name: 'Packaging Tapes', icon: '🎗️', color: 'from-purple-600 to-purple-800', desc: 'Branded & colored tapes' },
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [filters]);

    const loadCategories = async () => {
        try {
            const response = await productsAPI.getCategories();
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await productsAPI.getAll(filters);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        const params = new URLSearchParams();
        if (newFilters.search) params.set('search', newFilters.search);
        if (newFilters.category) params.set('category', newFilters.category);
        if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ search: '', category: '', sortBy: 'newest' });
        setSearchParams({});
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A to Z' },
    ];

    // Get current category info
    const currentCategory = filters.category ? categoryInfo[filters.category.toLowerCase()] : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '80px', paddingBottom: '64px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <div className="text-center" style={{ marginBottom: '48px' }}>
                    {currentCategory ? (
                        <>
                            <div className={`w-20 h-20 bg-gradient-to-br ${currentCategory.color} rounded-2xl flex items-center justify-center shadow-lg`} style={{ margin: '0 auto 16px', fontSize: '40px' }}>
                                {currentCategory.icon}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ marginBottom: '12px' }}>
                                {currentCategory.name}
                            </h1>
                            <p className="text-gray-600">{currentCategory.desc}</p>
                        </>
                    ) : (
                        <>
                            <span className="inline-block bg-purple-100 text-purple-600 text-sm font-bold uppercase tracking-wider rounded-full" style={{ padding: '8px 20px', marginBottom: '16px' }}>
                                All Products
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ marginBottom: '16px' }}>
                                Packaging Supplies
                            </h1>
                            <p className="text-gray-600 max-w-2xl" style={{ margin: '0 auto' }}>
                                Quality cardboard boxes, courier covers, and tapes for all your shipping needs
                            </p>
                        </>
                    )}
                </div>

                {/* Category Quick Filters */}
                <div className="flex flex-wrap justify-center" style={{ gap: '12px', marginBottom: '32px' }}>
                    <button
                        onClick={() => handleFilterChange('category', '')}
                        className={`flex items-center rounded-xl font-medium transition-all ${!filters.category ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'}`}
                        style={{ gap: '8px', padding: '12px 20px' }}
                    >
                        <Package size={18} />
                        All Products
                    </button>
                    <button
                        onClick={() => handleFilterChange('category', 'boxes')}
                        className={`flex items-center rounded-xl font-medium transition-all ${filters.category === 'boxes' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'}`}
                        style={{ gap: '8px', padding: '12px 20px' }}
                    >
                        📦 Boxes
                    </button>
                    <button
                        onClick={() => handleFilterChange('category', 'covers')}
                        className={`flex items-center rounded-xl font-medium transition-all ${filters.category === 'covers' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-300'}`}
                        style={{ gap: '8px', padding: '12px 20px' }}
                    >
                        📮 Covers
                    </button>
                    <button
                        onClick={() => handleFilterChange('category', 'tapes')}
                        className={`flex items-center rounded-xl font-medium transition-all ${filters.category === 'tapes' ? 'bg-purple-700 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'}`}
                        style={{ gap: '8px', padding: '12px 20px' }}
                    >
                        🎗️ Tapes
                    </button>
                </div>

                {/* Filters Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100" style={{ padding: '24px', marginBottom: '32px' }}>
                    <div className="flex flex-col lg:flex-row" style={{ gap: '16px' }}>
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                style={{ paddingLeft: '48px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                            />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="appearance-none w-full lg:w-48 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                style={{ padding: '12px 40px 12px 16px' }}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center bg-gray-50 rounded-xl" style={{ gap: '4px', padding: '4px' }}>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                style={{ padding: '10px' }}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                style={{ padding: '10px' }}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        {/* Clear */}
                        {(filters.search || filters.category) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl font-medium transition-all"
                                style={{ gap: '8px', padding: '12px 16px' }}
                            >
                                <X size={18} />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Active Filters */}
                {filters.search && (
                    <div className="flex flex-wrap" style={{ gap: '8px', marginBottom: '24px' }}>
                        <span className="inline-flex items-center bg-purple-100 text-purple-700 rounded-full text-sm font-medium" style={{ gap: '8px', padding: '8px 16px' }}>
                            Search: "{filters.search}"
                            <button onClick={() => handleFilterChange('search', '')} className="hover:text-purple-900">
                                <X size={14} />
                            </button>
                        </span>
                    </div>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{products.length}</span> products
                    </p>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center" style={{ padding: '96px 0' }}>
                        <div className="spinner"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div
                        className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
                        style={{ gap: '24px' }}
                    >
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-purple-50 rounded-3xl" style={{ padding: '96px 32px' }}>
                        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center" style={{ margin: '0 auto 24px' }}>
                            <Search size={32} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>No products found</h3>
                        <p className="text-gray-600" style={{ marginBottom: '24px' }}>Try adjusting your search or filter criteria</p>
                        <button
                            onClick={clearFilters}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all"
                            style={{ padding: '12px 24px' }}
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
