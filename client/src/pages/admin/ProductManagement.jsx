import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Upload, Image, Filter, ChevronDown, Package } from 'lucide-react';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/PageHeader';
import SearchBar from '../../components/admin/SearchBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productsAPI.getAllAdmin();
            setProducts(response.data.products);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        if (!formData.name || !formData.price) {
            toast.error('Name and price are required');
            return;
        }

        setSaving(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock || 0);
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

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const response = await productsAPI.delete(id);

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
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    // Add Product Button
    const AddProductButton = (
        <button
            onClick={() => handleOpenModal()}
            className="btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30 border-0"
        >
            <Plus size={20} />
            Add New Product
        </button>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Page Header */}
            <PageHeader
                title="Products"
                subtitle="Manage and organize your product catalog."
                actions={AddProductButton}
            />

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center" style={{ padding: '16px 20px' }}>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products by name or category..."
                        className="w-full md:w-80"
                    />
                    <span className="text-sm text-slate-500 whitespace-nowrap hidden md:inline">
                        {filteredProducts.length} products
                    </span>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors text-sm">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Table Header */}
                <div className="border-b border-slate-100" style={{ padding: '16px 20px' }}>
                    <h3 className="font-bold text-slate-800">All Products</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th style={{ padding: '12px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                                <th style={{ padding: '12px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th style={{ padding: '12px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                                <th style={{ padding: '12px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                <th style={{ padding: '12px 16px' }} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th style={{ padding: '12px 16px' }} className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="group hover:bg-purple-50/30 transition-colors">
                                    <td style={{ padding: '12px 16px' }}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 group-hover:border-purple-200 transition-colors">
                                                {product.image_url ? (
                                                    <img
                                                        src={`${API_URL}${product.image_url}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <Image size={24} className="text-slate-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0 max-w-xs">
                                                <p className="font-bold text-slate-800 truncate">{product.name}</p>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">{product.description || 'No description'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span className="inline-block px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                                            {product.category || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span className="font-bold text-slate-800">₹{product.price?.toFixed(2)}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                            <span className="text-sm text-slate-600 font-medium">{product.stock} units</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold border ${product.is_active
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-slate-50 text-slate-500 border-slate-200'
                                            }`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }} className="text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
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

            {/* Modal - Modern & Clean */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal} />

                    <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Image Upload Area */}
                            <div className="flex justify-center">
                                <div className="relative group">
                                    <div className={`w-32 h-32 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${imagePreview ? 'border-purple-200 bg-purple-50' : 'border-slate-300 bg-slate-50'}`}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Image className="mx-auto text-slate-400 mb-2" size={24} />
                                                <span className="text-xs text-slate-500">Upload Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl font-medium text-sm">
                                        <Upload size={18} className="mr-2" />
                                        Change
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                                        placeholder="e.g. Luxury Lip Balm"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                                        placeholder="e.g. Tubes"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm min-h-[100px]"
                                    placeholder="Describe your product..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3.5 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 btn btn-primary py-3.5 shadow-lg shadow-purple-500/20"
                                >
                                    {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : (editingProduct ? 'Save Changes' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
