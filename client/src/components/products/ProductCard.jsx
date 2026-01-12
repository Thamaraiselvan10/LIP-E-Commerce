import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ShieldCheck } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductCard({ product }) {
    const { addToCart } = useCartStore();
    const { isAuthenticated, isAdmin } = useAuthStore();
    const navigate = useNavigate();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If not logged in, redirect to login
        if (!isAuthenticated) {
            toast('Please login to add items to cart', { icon: '🔐' });
            navigate('/login');
            return;
        }

        // If admin, show message that they can't purchase
        if (isAdmin()) {
            toast.error('Admins cannot add items to cart');
            return;
        }

        const result = await addToCart(product.id);
        if (result.success) {
            toast.success('Added to cart!');
        } else {
            toast.error(result.error);
        }
    };

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`)
        : 'https://placehold.co/300x300/f1f5f9/94a3b8?text=No+Image';

    const userIsAdmin = isAuthenticated && isAdmin();

    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            aria-label={`View ${product.name} - ₹${product.price?.toFixed(2)}`}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-luxury-800/50">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="300"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/1a0b2e/e2e8f0?text=No+Image';
                    }}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300" aria-hidden="true"></div>

                {/* Quick Add Button - Hidden for admins */}
                {!userIsAdmin && (
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        aria-label={product.stock <= 0 ? 'Out of Stock' : `Add ${product.name} to cart`}
                        className={`absolute bottom-3 left-3 right-3 py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 focus:translate-y-0 focus:opacity-100 ${product.stock <= 0
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-white text-purple-600 hover:bg-purple-50 shadow-sm'
                            }`}
                    >
                        <ShoppingCart size={16} aria-hidden="true" />
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                )}

                {/* Admin View-Only Badge */}
                {userIsAdmin && (
                    <div className="absolute bottom-3 left-3 right-3 py-2 px-4 rounded-xl bg-gray-800/80 backdrop-blur-sm flex items-center justify-center gap-2 text-sm text-white font-medium" aria-label="Admin view only">
                        <ShieldCheck size={16} aria-hidden="true" />
                        View Only (Admin)
                    </div>
                )}

                {/* Category Badge */}
                {product.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-luxury-900/80 backdrop-blur-md border border-white/10 text-gold-400 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {product.category}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1" style={{ padding: '16px' }}>
                {/* Rating */}
                <div className="flex items-center" style={{ gap: '4px', marginBottom: '8px' }} aria-label="Rating: 4 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={12}
                            className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                            aria-hidden="true"
                        />
                    ))}
                    <span className="text-[10px] text-slate-400 font-medium" style={{ marginLeft: '4px' }}>(4.0)</span>
                </div>

                <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-purple-600 transition-colors" style={{ marginBottom: '6px' }}>
                    {product.name}
                </h3>

                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed flex-1" style={{ marginBottom: '16px' }}>
                    {product.description || 'Premium quality packaging solution for your business.'}
                </p>

                <div className="flex items-center justify-between border-t border-slate-50 mt-auto" style={{ paddingTop: '12px' }}>
                    <div>
                        <span className="text-lg font-bold text-white">
                            ₹{product.price?.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400" style={{ marginLeft: '4px' }}>/unit</span>
                    </div>

                    {product.stock > 0 && product.stock <= 10 && (
                        <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 rounded-full" style={{ padding: '2px 8px' }}>
                            Low Stock
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
