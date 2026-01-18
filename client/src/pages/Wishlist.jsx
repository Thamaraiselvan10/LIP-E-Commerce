import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/products/ProductCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
};

export default function Wishlist() {
    const { items, isLoading, fetchWishlist } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        }
    }, [isAuthenticated, fetchWishlist]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '80px' }}>
                <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center" style={{ marginBottom: '24px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Heart size={32} className="text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Please login to view your wishlist</h2>
                    <p className="text-gray-500" style={{ marginBottom: '32px' }}>Save items you love and come back to them later</p>
                    <Link to="/login" className="inline-flex items-center bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors" style={{ padding: '12px 32px' }}>
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white" style={{ paddingTop: '80px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '80px' }}>
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center" style={{ marginBottom: '24px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Heart size={32} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Your wishlist is empty</h2>
                    <p className="text-gray-500" style={{ marginBottom: '32px' }}>Start exploring products and save your favorites!</p>
                    <Link to="/products" className="inline-flex items-center bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors" style={{ gap: '8px', padding: '12px 32px' }}>
                        Explore Products <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <div className="flex items-center" style={{ gap: '12px', marginBottom: '32px' }}>
                    <Heart className="text-purple-600 fill-purple-600" size={28} />
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <span className="bg-purple-100 text-purple-700 font-bold rounded-full text-sm" style={{ padding: '4px 12px' }}>
                        {items.length}
                    </span>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    style={{ gap: '24px' }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {items.map((item) => (
                        <motion.div key={item.id} variants={itemVariants} className="h-full">
                            {/* We map the wishlist item structure back to what ProductCard expects */}
                            <ProductCard
                                product={{
                                    id: item.product_id,
                                    name: item.name,
                                    price: item.price,
                                    image_url: item.image_url,
                                    stock: item.stock,
                                    category: item.category
                                }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
