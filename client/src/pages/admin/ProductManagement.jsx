import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Upload, Image, Filter, ChevronDown, Package, Layers, List } from 'lucide-react';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/PageHeader';
import SearchBar from '../../components/admin/SearchBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCategoryListModal, setShowCategoryListModal] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null,
        is_active: true,
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productsAPI.getAllAdmin(),
                productsAPI.getCategoriesList()
            ]);
            setProducts(productsRes.data.products);
            setCategories(categoriesRes.data.categories);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await productsAPI.getAllAdmin();
            setProducts(response.data.products);
        } catch (error) {
            console.error(error);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await productsAPI.getCategoriesList();
            setCategories(response.data.categories);
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            image: null,
            is_active: true,
        });
        setImagePreview(null);
        setEditingProduct(null);
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                category: product.category || '',
                stock: product.stock,
                image: null,
                is_active: product.is_active === 1 || product.is_active === true,
            });
            setImagePreview(product.image_url ? `${API_URL}${product.image_url}` : null);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: All fields mandatory
        if (!formData.name || !formData.price || !formData.category || !formData.description || !formData.stock) {
            toast.error('All fields (Name, Category, Description, Price, Stock) are required');
            return;
        }

        setSaving(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock || 0);
        data.append('is_active', formData.is_active); // Send boolean/string, backend handles it
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (editingProduct) {
                await productsAPI.update(editingProduct.id, data);
                toast.success('Product updated successfully');
            } else {
                await productsAPI.create(data);
                toast.success('Product created successfully');
            }
            handleCloseModal();
            loadProducts();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    // Delete Confirmation State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            const response = await productsAPI.delete(productToDelete.id);

            // Check if it was a soft delete (archived)
            if (response.data.note) {
                toast.success(response.data.message);
                toast(response.data.note, {
                    icon: '📂',
                    duration: 5000,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            } else {
                toast.success('Product deleted permanently');
            }

            loadProducts();
            setShowDeleteConfirm(false);
            setProductToDelete(null);
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await productsAPI.createCategory(newCategoryName);
            toast.success('Category created successfully');
            setNewCategoryName('');
            setShowCategoryModal(false);
            loadCategories();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await productsAPI.deleteCategory(id);
            toast.success('Category deleted');
            loadCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    const handleToggleStatus = async (product) => {
        try {
            const newStatus = !product.is_active;
            const data = new FormData();
            // We need to send other required fields if backend validation is strict, 
            // but our backend uses existing values if not provided.
            // Sending just is_active should work based on our analysis of products.js
            data.append('is_active', newStatus);

            await productsAPI.update(product.id, data);
            toast.success(`Product ${newStatus ? 'activated' : 'deactivated'}`);
            loadProducts();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Header Actions
    const HeaderActions = (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setShowCategoryListModal(true)}
                className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm px-3 py-2 h-9"
            >
                <List size={16} />
                Categories
            </button>
            <button
                onClick={() => setShowCategoryModal(true)}
                className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm px-3 py-2 h-9"
            >
                <Layers size={16} />
                Add Category
            </button>
            <button
                onClick={() => handleOpenModal()}
                className="btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30 border-0 text-sm px-3 py-2 h-9"
            >
                <Plus size={18} />
                Add Product
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Page Header */}
            <PageHeader
                title="Products"
                subtitle="Manage catalog."
                actions={HeaderActions}
            />

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center p-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full md:w-64 h-9 text-sm"
                    />
                    <span className="text-xs text-slate-500 whitespace-nowrap hidden md:inline">
                        {filteredProducts.length} items
                    </span>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer h-9"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Table Header */}
                <div className="border-b border-slate-100 px-5 py-3">
                    <h3 className="font-bold text-slate-800 text-sm">Product List</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th style={{ padding: '10px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                                <th style={{ padding: '10px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th style={{ padding: '10px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                                <th style={{ padding: '10px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                <th style={{ padding: '10px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th style={{ padding: '10px 16px' }} className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="group hover:bg-purple-50/30 transition-colors">
                                    <td style={{ padding: '8px 16px' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 group-hover:border-purple-200 transition-colors">
                                                {product.image_url ? (
                                                    <img
                                                        src={`${API_URL}${product.image_url}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <Image size={16} className="text-slate-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0 max-w-xs">
                                                <p className="font-semibold text-slate-800 truncate text-sm">{product.name}</p>
                                                {/* <p className="text-xs text-slate-500 truncate mt-0.5">{product.description || 'No description'}</p> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '8px 16px' }}>
                                        <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                            {product.category || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '8px 16px' }}>
                                        <span className="font-semibold text-slate-800 text-sm">₹{product.price?.toFixed(2)}</span>
                                    </td>
                                    <td style={{ padding: '8px 16px' }}>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                            <span className="text-sm text-slate-600 font-medium">{product.stock}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '8px 16px' }}>
                                        <button
                                            onClick={() => handleToggleStatus(product)}
                                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wide ${product.is_active
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                                }`}
                                            title="Click to toggle status"
                                        >
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '8px 16px' }} className="text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(product)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="p-16 text-center text-slate-400 bg-slate-50/50">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium text-slate-600">No products found</p>
                        <p className="text-sm">Try adjusting your search or add a new product.</p>
                    </div>
                )}
            </div>

            {/* Create Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Create Category</h3>
                            <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCategory}>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Category Name</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="e.g. Lip Gloss"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-xl hover:bg-purple-700 transition"
                            >
                                Create Category
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Categories Modal */}
            {showCategoryListModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCategoryListModal(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scale-in p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Available Categories</h3>
                            <button onClick={() => setShowCategoryListModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto space-y-2">
                            {categories.length === 0 ? (
                                <p className="text-center text-slate-500 py-4">No categories created yet.</p>
                            ) : (
                                categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div>
                                            <span className="font-medium text-slate-700 block">{cat.name}</span>
                                            <span className="text-xs text-slate-400">ID: {cat.id}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Category"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal} />

                    <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-100" style={{ padding: '20px 24px' }}>
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
                            {/* Image Upload - Centered */}
                            <div className="flex justify-center" style={{ marginBottom: '20px' }}>
                                <div className="relative group">
                                    <div
                                        className={`w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${imagePreview
                                            ? 'border-purple-300 bg-purple-50'
                                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                                            }`}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <>
                                                <Image className="text-purple-400" size={24} style={{ marginBottom: '4px' }} />
                                                <span className="text-xs text-purple-600 font-medium">Upload</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {imagePreview && (
                                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-white text-xs font-medium flex items-center gap-1">
                                                <Upload size={14} /> Change
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name & Category - 2 columns */}
                            <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter the Product Name"
                                        className="w-full bg-white border-b border-gray-200 focus:border-purple-500 outline-none text-gray-800 placeholder-gray-400 transition-colors text-sm"
                                        style={{ padding: '8px 0' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-white border-b border-gray-200 focus:border-purple-500 outline-none text-gray-800 transition-colors appearance-none cursor-pointer text-sm"
                                            style={{ padding: '8px 0' }}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.name}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Description - Full width */}
                            <div style={{ marginBottom: '16px' }}>
                                <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your product..."
                                    rows={2}
                                    className="w-full bg-white border-b border-gray-200 focus:border-purple-500 outline-none text-gray-800 placeholder-gray-400 resize-none transition-colors text-sm"
                                    style={{ padding: '8px 0' }}
                                />
                            </div>

                            {/* Price & Stock - 2 columns */}
                            <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                                        Price (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full bg-white border-b border-gray-200 focus:border-purple-500 outline-none text-gray-800 placeholder-gray-400 transition-colors text-sm"
                                        style={{ padding: '8px 0' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full bg-white border-b border-gray-200 focus:border-purple-500 outline-none text-gray-800 placeholder-gray-400 transition-colors text-sm"
                                        style={{ padding: '8px 0' }}
                                    />
                                </div>
                            </div>

                            {/* Status - Checkbox */}
                            <div style={{ marginBottom: '24px' }}>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="peer sr-only"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        Product Active Status
                                    </span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                                    style={{ padding: '10px 20px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 text-sm"
                                    style={{ padding: '10px 20px' }}
                                >
                                    {saving ? (
                                        <Loader2 className="animate-spin mx-auto" size={18} />
                                    ) : (
                                        editingProduct ? 'Save Changes' : 'Create Product'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in p-6 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Product?</h3>
                        <p className="text-slate-500 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-slate-700">"{productToDelete?.name}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-white border-2 border-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
