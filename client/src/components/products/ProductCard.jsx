import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ShieldCheck, ArrowUpRight, Star, Heart, Eye } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import OptimizedImage from '../common/OptimizedImage';
import QuickViewModal from './QuickViewModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ProductCard({ product }) {
    const { addToCart } = useCartStore();
    const { isAuthenticated, isAdmin } = useAuthStore();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const inWishlist = useWishlistStore(state => state.items.some(item => item.product_id == product.id));
    const { addToWishlist, removeFromWishlist } = useWishlistStore();

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return toast('Login to use wishlist', { icon: '💖' });

        if (inWishlist) {
            await removeFromWishlist(product.id);
            toast.success('Removed from wishlist');
        } else {
            await addToWishlist(product.id);
            toast.success('Added to wishlist');
        }
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            toast('Login to add items', { icon: '🔐' });
            navigate('/login');
            return;
        }
        if (isAdmin()) return toast.error('Admins cannot purchase');

        const result = await addToCart(product.id);
        if (result.success) toast.success('Added to cart!');
    };

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`)
        : 'https://placehold.co/300x300/f3f4f6/9ca3af?text=No+Image';

    const userIsAdmin = isAuthenticated && isAdmin();

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-purple-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(147,51,234,0.08)] transition-all duration-500"
            >
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden bg-gray-50/50">
                    <Link to={`/products/${product.id}`} className="block w-full h-full p-8 transition-transform duration-700 group-hover:scale-110">
                        <OptimizedImage
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            width={300}
                            height={300}
                        />
                    </Link>

                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {product.stock <= 5 && product.stock > 0 && (
                            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                LOW STOCK
                            </span>
                        )}
                        <button
                            onClick={handleToggleWishlist}
                            className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-500 shadow-sm'}`}
                        >
                            <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    {/* Hover Actions */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-6 left-6 right-6 flex gap-2"
                            >
                                <button
                                    onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
                                    className="flex-1 bg-white text-gray-900 font-bold py-3 rounded-2xl shadow-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <Eye size={16} />
                                    Quick View
                                </button>
                                {!userIsAdmin && product.stock > 0 && (
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-12 h-12 bg-gray-900 text-white rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center active:scale-90"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Out of Stock Overlay */}
                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full">
                                OUT OF STOCK
                            </span>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {product.category || 'General'}
                        </span>
                        <div className="flex items-center text-amber-400">
                            <Star size={10} fill="currentColor" />
                            <span className="text-[10px] font-bold text-gray-500 ml-1">4.0</span>
                        </div>
                    </div>

                    <Link to={`/products/${product.id}`} className="block group/title">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover/title:text-purple-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="text-xl font-extrabold text-gray-900">
                            ₹{product.price?.toFixed(2)}
                        </span>
                        {userIsAdmin && (
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                                {product.stock} IN STOCK
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>

            <QuickViewModal
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </>
    );
}

export default memo(ProductCard);
