import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ShieldCheck, ArrowUpRight, Star } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import OptimizedImage from '../common/OptimizedImage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Animation variants
const cardVariants = {
    initial: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    hover: {
        y: -8,
        boxShadow: '0 20px 40px -15px rgba(147, 51, 234, 0.25)',
        transition: { duration: 0.3, ease: 'easeOut' }
    }
};

const buttonVariants = {
    initial: { y: 20, opacity: 0 },
    hover: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }
};

const arrowVariants = {
    initial: { y: 8, opacity: 0, scale: 0.8 },
    hover: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

function ProductCard({ product }) {
    const { addToCart } = useCartStore();
    const { isAuthenticated, isAdmin } = useAuthStore();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast('Please login to add items to cart', { icon: '🔐' });
            navigate('/login');
            return;
        }

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
        : 'https://placehold.co/300x300/f3f4f6/9ca3af?text=No+Image';

    const userIsAdmin = isAuthenticated && isAdmin();
    const soldCount = Math.floor(product.stock * 0.4) + 50;

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className="h-full"
        >
            <Link
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full block"
                aria-label={`View ${product.name} - ₹${product.price?.toFixed(2)}`}
            >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <OptimizedImage
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full"
                        style={{ padding: '16px' }}
                        width={300}
                        height={300}
                    />

                    {/* Hover Arrow Icon */}
                    <motion.div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                        variants={arrowVariants}
                    >
                        <ArrowUpRight size={16} className="text-gray-700" />
                    </motion.div>

                    {/* Quick Add Button - Hidden for admins */}
                    {!userIsAdmin && (
                        <motion.button
                            onClick={handleAddToCart}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            disabled={product.stock <= 0}
                            aria-label={product.stock <= 0 ? 'Out of Stock' : `Add ${product.name} to cart`}
                            style={{
                                position: 'absolute',
                                bottom: '16px',
                                left: '16px',
                                right: '16px',
                                padding: '12px 20px',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                background: product.stock <= 0
                                    ? '#e5e7eb'
                                    : (isHovered
                                        ? 'linear-gradient(to right, #7e22ce, #6b21a8)'
                                        : 'linear-gradient(to right, #9333ea, #7e22ce)'),
                                color: product.stock <= 0 ? '#9ca3af' : 'white',
                                cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                                boxShadow: (!product.stock <= 0 && isHovered)
                                    ? '0 10px 15px -3px rgba(168, 85, 247, 0.4)'
                                    : '0 4px 6px -2px rgba(168, 85, 247, 0.1)',
                                border: 'none'
                            }}
                            variants={buttonVariants}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ShoppingCart size={18} aria-hidden="true" />
                            <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                        </motion.button>
                    )}

                    {/* Admin View-Only Badge */}
                    {userIsAdmin && (
                        <div className="absolute bottom-3 left-3 right-3 py-2 px-4 rounded-xl bg-gray-800/90 backdrop-blur-sm flex items-center justify-center gap-2 text-sm text-white font-medium">
                            <ShieldCheck size={16} aria-hidden="true" />
                            View Only
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-gray-900 text-white text-xs font-bold rounded-full px-4 py-2">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1" style={{ padding: '16px' }}>
                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 line-clamp-1 transition-colors" style={{ marginBottom: '6px' }}>
                        {product.name}
                    </h3>

                    {/* Price */}
                    <span className="text-lg font-bold text-gray-900" style={{ marginBottom: '12px' }}>
                        ₹{product.price?.toFixed(2)}
                    </span>

                    {/* Stock and Sold */}
                    {/* Footer Info: Admin sees Stock/Sold, User sees Ratings */}
                    <div className="flex items-center mt-auto">
                        {userIsAdmin ? (
                            <div className="flex items-center" style={{ gap: '16px' }}>
                                <div className="flex items-center" style={{ gap: '4px' }}>
                                    <span className="text-xs text-gray-400">Stock:</span>
                                    <span className="text-xs font-semibold text-gray-700">{product.stock}</span>
                                </div>
                                <div className="flex items-center" style={{ gap: '4px' }}>
                                    <span className="text-xs text-gray-400">Sold:</span>
                                    <span className="text-xs font-semibold text-gray-700">{soldCount}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center" style={{ gap: '4px' }}>
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-sm font-medium text-gray-700">4.5</span>
                                <span className="text-xs text-gray-400">(128 reviews)</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default memo(ProductCard);
