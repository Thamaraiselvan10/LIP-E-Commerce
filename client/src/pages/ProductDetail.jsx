import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Package, Check, Star, Truck, Shield, RotateCcw, ShieldCheck, Heart, Share2, ChevronLeft, ChevronRight, Sparkles, Box, Info } from 'lucide-react';
import { productsAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/products/ProductCard';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isCartHovered, setIsCartHovered] = useState(false);
    const [isBuyHovered, setIsBuyHovered] = useState(false);
    const { addToCart } = useCartStore();
    const { isAuthenticated, isAdmin } = useAuthStore();

    useEffect(() => {
        loadProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const loadProduct = async () => {
        try {
            const response = await productsAPI.getById(id);
            setProduct(response.data.product);

            // Load related products from the same category
            if (response.data.product?.category) {
                const relatedRes = await productsAPI.getAll({
                    category: response.data.product.category,
                    limit: 4
                });
                setRelatedProducts(
                    relatedRes.data.products.filter(p => p.id !== response.data.product.id).slice(0, 4)
                );
            }
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

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            toast('Please login to continue', { icon: '🔐' });
            navigate('/login?redirect=/checkout');
            return;
        }

        if (isAdmin()) {
            toast.error('Admins cannot purchase products');
            return;
        }

        const result = await addToCart(product.id, quantity);
        if (result.success) {
            navigate('/cart');
        } else {
            toast.error(result.error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white" style={{ paddingTop: '80px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) return null;

    // Generate image array (for now just the main image, but prepared for multiple)
    const images = product.image_url
        ? [product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`]
        : ['https://placehold.co/600x600/f8f8f8/999?text=No+Image'];

    const userIsAdmin = isAuthenticated && isAdmin();

    // Calculate prices
    const originalPrice = product.price * 1.2;
    const discountPercent = 20;

    // Product specifications (can be extended based on product data)
    const specifications = [
        { label: 'SKU', value: `PM-${String(product.id).padStart(4, '0')}` },
        { label: 'Category', value: product.category || 'General' },
        ...(userIsAdmin ? [{ label: 'Stock', value: `${product.stock} units` }] : []),
        { label: 'Material', value: 'Premium Quality' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb Navigation */}
            <div className="bg-gray-50 border-b border-gray-100" style={{ paddingTop: '80px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px' }}>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/products')}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            style={{ gap: '8px' }}
                        >
                            <ChevronLeft size={20} />
                            <span className="font-medium">Back to Products</span>
                        </button>
                        <div className="flex items-center" style={{ gap: '8px' }}>
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
                            >
                                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 flex items-center justify-center transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ paddingTop: '48px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                    <div className="grid lg:grid-cols-2" style={{ gap: '80px' }}>

                        {/* Left: Image Gallery */}
                        <div className="relative">
                            {/* Main Image Container */}
                            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative group">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    style={{ padding: '32px' }}
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/600x600/f8f8f8/999?text=No+Image';
                                    }}
                                />

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}

                                {/* Low Stock Badge */}
                                {product.stock <= 10 && product.stock > 0 && (
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg" style={{ padding: '6px 14px' }}>
                                            Only {product.stock} left!
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Image Dots/Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex items-center justify-center" style={{ gap: '8px', marginTop: '20px' }}>
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImageIndex
                                                ? 'bg-purple-600 w-8'
                                                : 'bg-gray-300 hover:bg-purple-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Single Image Indicator Line */}
                            {images.length === 1 && (
                                <div className="flex items-center justify-center" style={{ marginTop: '20px' }}>
                                    <div className="w-16 h-1 bg-purple-600 rounded-full"></div>
                                </div>
                            )}
                        </div>

                        {/* Right: Product Details */}
                        <div>
                            {/* Category Badge */}
                            {product.category && (
                                <span className="inline-block bg-purple-600 text-white text-xs font-semibold uppercase tracking-wider rounded-full" style={{ padding: '6px 16px', marginBottom: '20px' }}>
                                    {product.category}
                                </span>
                            )}

                            {/* Product Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ marginBottom: '16px', lineHeight: '1.2' }}>
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center" style={{ gap: '12px', marginBottom: '24px' }}>
                                <div className="flex items-center" style={{ gap: '4px' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                    ))}
                                </div>
                                <span className="text-gray-900 font-medium">4.0</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500">24 reviews</span>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-baseline flex-wrap" style={{ gap: '16px', marginBottom: '24px' }}>
                                <span className="text-4xl font-bold text-gray-900">
                                    ₹{product.price?.toFixed(2)}
                                </span>
                                <span className="text-gray-400 line-through text-lg">
                                    ₹{originalPrice.toFixed(2)}
                                </span>
                                <span className="bg-amber-500 text-white text-xs font-bold rounded-full" style={{ padding: '4px 12px' }}>
                                    {discountPercent}% OFF
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed" style={{ marginBottom: '32px', fontSize: '16px', lineHeight: '1.8' }}>
                                {product.description || 'Premium quality packaging solution designed for e-commerce and shipping needs. Made with durable materials to ensure your products arrive safely.'}
                            </p>

                            {/* Stock Status */}
                            <div className="flex items-center" style={{ gap: '10px', marginBottom: '32px' }}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                                    <Check className="text-white" size={12} />
                                </div>
                                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0
                                        ? (userIsAdmin ? `In Stock (${product.stock} available)` : 'In Stock')
                                        : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Admin Notice */}
                            {userIsAdmin && (
                                <div className="flex items-center bg-gray-100 rounded-xl" style={{ gap: '12px', padding: '16px', marginBottom: '32px' }}>
                                    <ShieldCheck size={20} className="text-gray-600" />
                                    <span className="text-gray-600 text-sm font-medium">Admin View - Purchase disabled</span>
                                </div>
                            )}

                            {/* Quantity & Actions */}
                            {product.stock > 0 && !userIsAdmin && (
                                <div style={{ marginBottom: '32px' }}>
                                    {/* Quantity Selector */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>
                                            Quantity
                                        </label>
                                        <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"
                                                style={{ padding: '14px 18px' }}
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="font-bold text-lg text-gray-900 text-center" style={{ minWidth: '50px' }}>
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                disabled={quantity >= product.stock}
                                                className="hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"
                                                style={{ padding: '14px 18px' }}
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col" style={{ gap: '12px' }}>
                                        <button
                                            onClick={handleAddToCart}
                                            onMouseEnter={() => setIsCartHovered(true)}
                                            onMouseLeave={() => setIsCartHovered(false)}
                                            style={{
                                                width: '100%',
                                                backgroundColor: isCartHovered ? '#7e22ce' : '#9333ea', // purple-700 : purple-600
                                                color: 'white',
                                                fontWeight: 'bold',
                                                borderRadius: '0.75rem', // rounded-xl
                                                boxShadow: isCartHovered
                                                    ? '0 10px 15px -3px rgba(168, 85, 247, 0.4), 0 4px 6px -2px rgba(168, 85, 247, 0.2)'
                                                    : '0 10px 15px -3px rgba(168, 85, 247, 0.25), 0 4px 6px -2px rgba(168, 85, 247, 0.1)',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                padding: '18px 32px',
                                                cursor: 'pointer',
                                                border: 'none'
                                            }}
                                        >
                                            <ShoppingCart size={20} />
                                            Add to Cart — ₹{(product.price * quantity).toFixed(2)}
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            onMouseEnter={() => setIsBuyHovered(true)}
                                            onMouseLeave={() => setIsBuyHovered(false)}
                                            style={{
                                                width: '100%',
                                                backgroundColor: isBuyHovered ? '#f5f3ff' : 'white', // purple-50 : white
                                                color: '#7e22ce', // purple-700
                                                fontWeight: 'bold',
                                                borderRadius: '0.75rem', // rounded-xl
                                                border: '2px solid #9333ea', // purple-600
                                                transition: 'all 0.2s',
                                                padding: '16px 32px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Out of Stock Button */}
                            {product.stock <= 0 && !userIsAdmin && (
                                <button
                                    disabled
                                    className="w-full bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed"
                                    style={{ padding: '18px 32px', marginBottom: '32px' }}
                                >
                                    Out of Stock
                                </button>
                            )}

                            {/* Benefits Row */}
                            <div className="grid grid-cols-3 border-t border-gray-100" style={{ paddingTop: '24px', gap: '16px' }}>
                                {[
                                    { icon: Truck, label: 'Free Delivery', sublabel: 'On ₹2000+', color: 'text-purple-500' },
                                    { icon: Shield, label: 'Quality Assured', sublabel: 'Premium materials', color: 'text-amber-500' },
                                    { icon: RotateCcw, label: 'Easy Returns', sublabel: '30 days', color: 'text-purple-500' },
                                ].map((benefit, i) => (
                                    <div key={i} className="text-center">
                                        <benefit.icon size={20} className={benefit.color} style={{ margin: '0 auto 8px' }} />
                                        <p className="font-medium text-gray-700 text-xs">{benefit.label}</p>
                                        <p className="text-gray-400 text-xs">{benefit.sublabel}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description & Specifications Section */}
                    <div className="grid lg:grid-cols-2 border-t border-gray-100" style={{ marginTop: '80px', paddingTop: '64px', gap: '64px' }}>
                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '24px' }}>
                                Description
                            </h2>
                            <div className="text-gray-600 leading-relaxed" style={{ lineHeight: '1.9' }}>
                                <p style={{ marginBottom: '16px' }}>
                                    {product.description || 'Designed for those who value both form and function, this premium packaging solution brings a new level of quality to everyday shipping needs.'}
                                </p>
                                <p>
                                    Made from premium materials and finished with attention to detail, this product is built to protect your items during transit. Perfect for e-commerce sellers, retailers, and businesses looking for reliable packaging solutions.
                                </p>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '24px' }}>
                                Specifications
                            </h2>
                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                                {specifications.map((spec, index) => (
                                    <div
                                        key={index}
                                        className={`flex justify-between ${index !== specifications.length - 1 ? 'border-b border-gray-100' : ''}`}
                                        style={{ padding: '16px 20px' }}
                                    >
                                        <span className="text-gray-500">{spec.label}</span>
                                        <span className="text-gray-900 font-medium">{spec.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* What's Included */}
                            <div style={{ marginTop: '32px' }}>
                                <h3 className="font-bold text-gray-900" style={{ marginBottom: '16px' }}>
                                    What's Included
                                </h3>
                                <ul className="text-gray-600" style={{ lineHeight: '2' }}>
                                    <li className="flex items-center" style={{ gap: '10px' }}>
                                        <Check size={16} className="text-green-500" />
                                        {product.name}
                                    </li>
                                    <li className="flex items-center" style={{ gap: '10px' }}>
                                        <Check size={16} className="text-green-500" />
                                        Quality packaging
                                    </li>
                                    <li className="flex items-center" style={{ gap: '10px' }}>
                                        <Check size={16} className="text-green-500" />
                                        Product warranty
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    <div className="border-t border-gray-100" style={{ marginTop: '80px', paddingTop: '64px' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '4px' }}>
                                    Discover Other Products
                                </h2>
                                <p className="text-gray-500">You may also like these</p>
                            </div>
                            <Link
                                to="/products"
                                className="text-purple-600 hover:text-purple-700 font-medium flex items-center transition-colors"
                                style={{ gap: '4px' }}
                            >
                                View All <ChevronRight size={16} />
                            </Link>
                        </div>

                        {relatedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
                                {relatedProducts.map((relProduct) => (
                                    <ProductCard key={relProduct.id} product={relProduct} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl flex items-center justify-center" style={{ padding: '60px 32px' }}>
                                <div className="text-center">
                                    <Box size={40} className="text-gray-300" style={{ margin: '0 auto 16px' }} />
                                    <p className="text-gray-500">More products coming soon</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
