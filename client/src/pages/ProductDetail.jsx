import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Package, Check, Star, Truck, Shield, RotateCcw, ShieldCheck, Heart, Share2, ChevronLeft, Sparkles } from 'lucide-react';
import { productsAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const { addToCart } = useCartStore();
    const { isAuthenticated, isAdmin } = useAuthStore();

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const response = await productsAPI.getById(id);
            setProduct(response.data.product);
        } catch (error) {
            console.error('Failed to load product:', error);
            toast.error('Product not found');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast('Please login to add items to cart', { icon: '🔐' });
            navigate('/login');
            return;
        }

        if (isAdmin()) {
            toast.error('Admins cannot add items to cart');
            return;
        }

        const result = await addToCart(product.id, quantity);
        if (result.success) {
            toast.success(`Added ${quantity} item(s) to cart!`);
        } else {
            toast.error(result.error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '64px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) return null;

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`)
        : 'https://placehold.co/600x600/EEE/999?text=No+Image';

    const userIsAdmin = isAuthenticated && isAdmin();

    const benefits = [
        { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹2000' },
        { icon: Shield, title: 'Quality Assured', desc: 'Premium materials only' },
        { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/30 via-white to-amber-50/20">
            {/* Top Navigation Bar */}
            <div className="fixed top-16 lg:top-20 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-purple-100 z-30" style={{ padding: '12px 24px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/products')}
                            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                            style={{ gap: '8px' }}
                        >
                            <ChevronLeft size={20} />
                            <span className="font-medium">Back to Products</span>
                        </button>
                        <div className="flex items-center" style={{ gap: '8px' }}>
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-500'}`}
                            >
                                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 hover:text-purple-600 flex items-center justify-center transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ paddingTop: '140px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                    <div className="grid lg:grid-cols-2" style={{ gap: '64px' }}>

                        {/* Left: Image Section */}
                        <div className="relative">
                            {/* Main Image */}
                            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 via-white to-amber-50 border border-purple-100/50 shadow-2xl shadow-purple-500/10 relative">
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/600x600/EEE/999?text=No+Image';
                                    }}
                                />

                                {/* Category Badge */}
                                {product.category && (
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-white/90 backdrop-blur-sm text-purple-700 text-sm font-bold rounded-full shadow-lg" style={{ padding: '8px 20px' }}>
                                            {product.category}
                                        </span>
                                    </div>
                                )}

                                {/* Stock Badge */}
                                {product.stock <= 10 && product.stock > 0 && (
                                    <div className="absolute top-6 right-6">
                                        <span className="bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg" style={{ padding: '6px 14px' }}>
                                            Only {product.stock} left!
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl -z-10 opacity-20"></div>
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl -z-10 opacity-20"></div>
                        </div>

                        {/* Right: Product Details */}
                        <div style={{ paddingTop: '16px' }}>
                            {/* Rating */}
                            <div className="flex items-center" style={{ gap: '12px', marginBottom: '16px' }}>
                                <div className="flex items-center bg-amber-50 rounded-full" style={{ gap: '4px', padding: '6px 14px' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                    ))}
                                    <span className="text-amber-700 font-semibold text-sm" style={{ marginLeft: '6px' }}>4.0</span>
                                </div>
                                <span className="text-gray-500 text-sm">(24 reviews)</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ marginBottom: '20px', lineHeight: '1.2' }}>
                                {product.name}
                            </h1>

                            {/* Price Section */}
                            <div className="flex items-end flex-wrap" style={{ gap: '16px', marginBottom: '24px' }}>
                                <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    ₹{product.price?.toFixed(2)}
                                </span>
                                <span className="text-gray-400 line-through text-xl" style={{ marginBottom: '6px' }}>
                                    ₹{(product.price * 1.2).toFixed(2)}
                                </span>
                                <span className="bg-green-100 text-green-700 text-sm font-bold rounded-full" style={{ padding: '4px 12px', marginBottom: '6px' }}>
                                    20% OFF
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed" style={{ marginBottom: '32px' }}>
                                {product.description || 'Premium quality packaging solution designed for e-commerce and shipping needs. Made with durable materials to ensure your products arrive safely.'}
                            </p>

                            {/* Stock Status */}
                            <div className="flex items-center rounded-2xl" style={{ gap: '16px', padding: '20px', marginBottom: '32px', background: product.stock > 0 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)' }}>
                                {product.stock > 0 ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                                            <Check className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-800 text-lg">In Stock</p>
                                            <p className="text-green-600 text-sm">{product.stock} units available for immediate shipping</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                                            <Package className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-red-800 text-lg">Out of Stock</p>
                                            <p className="text-red-600 text-sm">Currently unavailable - check back soon</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Admin Notice */}
                            {userIsAdmin && (
                                <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl" style={{ gap: '16px', padding: '20px', marginBottom: '32px' }}>
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Admin View Only</p>
                                        <p className="text-gray-300 text-sm">Administrators cannot purchase products</p>
                                    </div>
                                </div>
                            )}

                            {/* Quantity & Add to Cart - Hidden for admins */}
                            {product.stock > 0 && !userIsAdmin && (
                                <div style={{ marginBottom: '32px' }}>
                                    <p className="text-sm font-medium text-gray-700" style={{ marginBottom: '12px' }}>Quantity</p>
                                    <div className="flex flex-col sm:flex-row" style={{ gap: '16px' }}>
                                        <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                                style={{ padding: '16px 20px' }}
                                            >
                                                <Minus size={20} />
                                            </button>
                                            <span className="font-bold text-xl text-center" style={{ minWidth: '60px' }}>
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                disabled={quantity >= product.stock}
                                                className="hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                                style={{ padding: '16px 20px' }}
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40 transition-all flex items-center justify-center"
                                            style={{ gap: '12px', padding: '18px 32px' }}
                                        >
                                            <ShoppingCart size={24} />
                                            Add to Cart — ₹{(product.price * quantity).toFixed(2)}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            <div className="grid grid-cols-3" style={{ gap: '16px' }}>
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="text-center bg-white rounded-2xl border border-purple-100 shadow-sm" style={{ padding: '20px 12px' }}>
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center" style={{ margin: '0 auto 12px' }}>
                                            <benefit.icon size={22} className="text-purple-600" />
                                        </div>
                                        <p className="font-semibold text-gray-800 text-sm" style={{ marginBottom: '4px' }}>{benefit.title}</p>
                                        <p className="text-xs text-gray-500">{benefit.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* SKU */}
                            <div className="border-t border-gray-100" style={{ marginTop: '32px', paddingTop: '20px' }}>
                                <p className="text-sm text-gray-400">
                                    <span className="font-medium">SKU:</span> PM-{String(product.id).padStart(4, '0')} •
                                    <span className="font-medium" style={{ marginLeft: '12px' }}>Category:</span> {product.category || 'General'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section Placeholder */}
                    <div className="border-t border-purple-100" style={{ marginTop: '80px', paddingTop: '64px' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '4px' }}>You May Also Like</h2>
                                <p className="text-gray-500">Customers who viewed this also viewed</p>
                            </div>
                            <Link to="/products" className="text-purple-600 hover:text-purple-700 font-medium flex items-center" style={{ gap: '4px' }}>
                                View All <ChevronLeft size={16} className="rotate-180" />
                            </Link>
                        </div>
                        <div className="bg-purple-50/50 rounded-3xl flex items-center justify-center" style={{ padding: '80px 32px' }}>
                            <div className="text-center">
                                <Sparkles size={48} className="text-purple-300" style={{ margin: '0 auto 16px' }} />
                                <p className="text-gray-500">Related products coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
