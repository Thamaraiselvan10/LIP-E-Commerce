import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Box, Truck, Star, Shield, Zap, Award, ChevronRight, ShoppingBag } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const productsRes = await productsAPI.getAll({ limit: 8 });
            setProducts(productsRes.data.products.slice(0, 8));
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { name: 'Cardboard Boxes', icon: '📦', desc: 'All sizes available', color: 'from-purple-500 to-indigo-500', link: '/products?category=boxes' },
        { name: 'Courier Covers', icon: '📮', desc: 'Amazon, Flipkart & more', color: 'from-amber-500 to-yellow-500', link: '/products?category=covers' },
        { name: 'Packaging Tapes', icon: '🎗️', desc: 'Branded & Plain', color: 'from-purple-600 to-purple-700', link: '/products?category=tapes' },
    ];

    const benefits = [
        { icon: Zap, title: 'Fast Delivery', desc: 'Same day dispatch for orders before 2 PM', color: 'bg-amber-500' },
        { icon: Shield, title: 'Quality Assured', desc: 'Premium quality packaging materials', color: 'bg-purple-500' },
        { icon: Award, title: 'Best Prices', desc: 'Wholesale rates for retailers', color: 'bg-amber-600' },
        { icon: Truck, title: 'Pan India Shipping', desc: 'We deliver across all states', color: 'bg-purple-600' },
    ];

    const boxSizes = ['3x3', '4x4', '5x5', '6x6', '8x8', '10x10', '12x12', '14x14'];

    const brandedCovers = [
        { name: 'Amazon', color: 'bg-[#FF9900]' },
        { name: 'Flipkart', color: 'bg-[#2874F0]' },
        { name: 'Meesho', color: 'bg-[#F43397]' },
        { name: 'Myntra', color: 'bg-[#FF3E6C]' },
    ];

    const testimonials = [
        { name: 'Rajesh Kumar', role: 'E-commerce Seller', text: 'Best quality boxes at wholesale prices. My packaging costs reduced by 30%!', avatar: 'R', rating: 5 },
        { name: 'Priya Sharma', role: 'Online Retailer', text: 'Fast delivery and excellent quality courier covers. Highly recommended!', avatar: 'P', rating: 5 },
        { name: 'Amit Patel', role: 'Business Owner', text: 'One-stop shop for all packaging needs. Great customer service!', avatar: 'A', rating: 5 },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background Gradient - Purple & Gold */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900" aria-hidden="true"></div>

                {/* Simplified decorative elements for mobile performance */}
                <div className="absolute inset-0 overflow-hidden hidden md:block" aria-hidden="true">
                    <div className="absolute w-96 h-96 bg-amber-400/20 rounded-full" style={{ top: '10%', left: '5%', filter: 'blur(60px)' }}></div>
                    <div className="absolute w-80 h-80 bg-purple-500/30 rounded-full" style={{ bottom: '10%', right: '10%', filter: 'blur(60px)' }}></div>
                </div>

                {/* Grid Pattern - hidden on mobile */}
                <div className="absolute inset-0 opacity-10 hidden md:block" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} aria-hidden="true"></div>

                <div className="relative z-10 w-full" style={{ maxWidth: '1400px', margin: '0 auto', padding: '120px 32px 80px' }}>
                    <div className="grid lg:grid-cols-2 items-center" style={{ gap: '64px' }}>
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center bg-white/10 border border-white/20 rounded-full" style={{ gap: '8px', padding: '8px 20px', marginBottom: '32px' }}>
                                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                                <span className="text-purple-200 text-sm font-medium">Wholesale Packaging Supplies</span>
                            </div>

                            <h1 className="text-white font-bold leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '24px' }}>
                                Premium Packaging
                                <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                                    For Your Business
                                </span>
                            </motion.h1>

                            <p className="text-purple-200/90 text-lg max-w-lg" style={{ marginBottom: '40px', lineHeight: '1.8' }}>
                                Quality cardboard boxes, branded courier covers, and packaging tapes at wholesale prices.
                                Perfect for e-commerce sellers, retailers, and businesses.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap justify-center lg:justify-start" style={{ gap: '16px', marginBottom: '48px' }}>
                                <Link
                                    to="/products"
                                    className="group inline-flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 font-bold rounded-full shadow-lg shadow-amber-500/30 transition-all"
                                    style={{ gap: '8px', padding: '18px 36px' }}
                                >
                                    Shop Now
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 transition-all"
                                    style={{ gap: '8px', padding: '18px 36px' }}
                                >
                                    Get Bulk Quote
                                </Link>
                            </motion.div>

                            {/* Stats Row */}
                            <div className="flex flex-wrap justify-center lg:justify-start" style={{ gap: '40px' }}>
                                {[
                                    { value: '5000+', label: 'Happy Customers' },
                                    { value: '50+', label: 'Products' },
                                    { value: '4.9★', label: 'Rating' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center lg:text-left">
                                        <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
                                        <div className="text-purple-300 text-sm">{stat.label}</div>
                                    </div>

                        {/* Right - Product Showcase */}
                        <div className="hidden lg:flex items-center justify-center relative">
                            <div className="relative">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-purple-500/20 rounded-3xl blur-3xl scale-110"></div>

                                {/* Product Grid */}
                                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden" style={{ padding: '32px' }}>
                                    <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                                        {categories.map((cat, i) => (
                                            <Link
                                                key={i}
                                                to={cat.link}
                                                className="bg-white/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                                                style={{ padding: '28px', aspectRatio: i === 2 ? 'auto' : '1' }}
                                            >
                                                <span style={{ fontSize: '40px', marginBottom: '12px' }}>{cat.icon}</span>
                                                <span className="text-white font-semibold text-sm">{cat.name}</span>
                                            </Link>
                                        ))}
                                        <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex flex-col items-center justify-center" style={{ padding: '28px' }}>
                                            <span className="text-3xl font-bold text-purple-900">50+</span>
                                            <span className="text-purple-800 text-sm font-medium">Products</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute bg-white rounded-2xl shadow-2xl flex items-center" style={{ gap: '12px', padding: '16px 20px', top: '-20px', right: '-20px' }}>
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Truck className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-800">Free Shipping</div>
                                        <div className="text-xs text-gray-500">Orders above ₹2000</div>
                                    </div>
                                </div>

                                {/* Floating Badge - Top Right */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -right-4 bg-[#1a1225]/95 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-xl"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium text-sm">Quality Verified</div>
                                            <div className="text-xs text-gray-500">ISO Certified</div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Badge - Bottom Left */}
                                <motion.div
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-4 -left-4 bg-[#1a1225]/95 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-xl"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1.5">
                                            <div className="w-6 h-6 rounded-full bg-red-400 border-2 border-[#1a1225]" />
                                            <div className="w-6 h-6 rounded-full bg-teal-400 border-2 border-[#1a1225]" />
                                            <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-[#1a1225]" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium text-sm">500+ Brands</div>
                                            <div className="text-xs text-gray-500">Trust Us</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" style={{ width: '100%', height: '120px' }}>
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Benefits Bar */}
            <section className="bg-white relative" style={{ marginTop: '-1px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>
                    <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center" style={{ gap: '16px' }}>
                                <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <benefit.icon className="text-white" size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">{benefit.title}</div>
                                    <div className="text-sm text-gray-500">{benefit.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="bg-purple-50" style={{ padding: '100px 0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
                    {/* Section Header */}
                    <div className="text-center" style={{ marginBottom: '64px' }}>
                        <span className="inline-block bg-purple-100 text-purple-600 text-sm font-bold uppercase tracking-wider rounded-full" style={{ padding: '8px 20px', marginBottom: '16px' }}>
                            Our Products
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ marginBottom: '16px' }}>
                            Shop by Category
                        </h2>
                        <p className="text-gray-600 max-w-2xl" style={{ margin: '0 auto' }}>
                            Quality packaging materials for all your shipping and storage needs
                        </p>
                    </motion.div>

                    {/* Categories Grid */}
                    <div className="grid md:grid-cols-3" style={{ gap: '32px' }}>
                        {/* Cardboard Boxes */}
                        <Link
                            to="/products?category=boxes"
                            className="group relative bg-white rounded-3xl border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/10 transition-all overflow-hidden"
                            style={{ padding: '40px' }}
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{ marginBottom: '24px', fontSize: '40px' }}>
                                📦
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800" style={{ marginBottom: '8px' }}>Cardboard Boxes</h3>
                            <p className="text-gray-500" style={{ marginBottom: '16px' }}>All sizes available for shipping & storage</p>
                            <div className="flex flex-wrap" style={{ gap: '8px' }}>
                                {boxSizes.slice(0, 4).map((size, i) => (
                                    <span key={i} className="bg-purple-50 text-purple-700 text-xs font-medium rounded-lg" style={{ padding: '4px 10px' }}>
                                        {size} inch
                                    </span>
                                ))}
                                <span className="bg-gray-100 text-gray-600 text-xs font-medium rounded-lg" style={{ padding: '4px 10px' }}>
                                    +more
                                </span>
                            </div>
                            <div className="absolute bottom-6 right-6 w-10 h-10 bg-gray-100 group-hover:bg-purple-500 rounded-full flex items-center justify-center transition-all">
                                <ChevronRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                        </Link>

                        {/* Courier Covers */}
                        <Link
                            to="/products?category=covers"
                            className="group relative bg-white rounded-3xl border border-gray-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/10 transition-all overflow-hidden"
                            style={{ padding: '40px' }}
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{ marginBottom: '24px', fontSize: '40px' }}>
                                📮
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800" style={{ marginBottom: '8px' }}>Courier Covers</h3>
                            <p className="text-gray-500" style={{ marginBottom: '16px' }}>Branded & plain courier bags</p>
                            <div className="flex flex-wrap" style={{ gap: '8px' }}>
                                {brandedCovers.map((brand, i) => (
                                    <span key={i} className={`${brand.color} text-white text-xs font-medium rounded-lg`} style={{ padding: '4px 10px' }}>
                                        {brand.name}
                                    </span>
                                ))}
                            </div>
                            <div className="absolute bottom-6 right-6 w-10 h-10 bg-gray-100 group-hover:bg-amber-500 rounded-full flex items-center justify-center transition-all">
                                <ChevronRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                        </Link>

                        {/* Tapes */}
                        <Link
                            to="/products?category=tapes"
                            className="group relative bg-white rounded-3xl border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/10 transition-all overflow-hidden"
                            style={{ padding: '40px' }}
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{ marginBottom: '24px', fontSize: '40px' }}>
                                🎗️
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800" style={{ marginBottom: '8px' }}>Packaging Tapes</h3>
                            <p className="text-gray-500" style={{ marginBottom: '16px' }}>Branded & colored tapes</p>
                            <div className="flex flex-wrap" style={{ gap: '8px' }}>
                                {['Amazon', 'Flipkart', 'Black', 'White'].map((tape, i) => (
                                    <span key={i} className="bg-purple-50 text-purple-700 text-xs font-medium rounded-lg" style={{ padding: '4px 10px' }}>
                                        {tape}
                                    </span>
                                ))}
                            </div>
                            <div className="absolute bottom-6 right-6 w-10 h-10 bg-gray-100 group-hover:bg-purple-600 rounded-full flex items-center justify-center transition-all">
                                <ChevronRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="bg-white" style={{ padding: '100px 0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between" style={{ marginBottom: '48px' }}>
                        <div>
                            <span className="inline-block bg-amber-100 text-amber-600 text-sm font-bold uppercase tracking-wider rounded-full" style={{ padding: '8px 20px', marginBottom: '16px' }}>
                                Best Sellers
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Popular Products
                            </h2>
                        </div>
                        <Link
                            to="/products"
                            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group"
                            style={{ gap: '8px', marginTop: '16px' }}
                        >
                            View All Products
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex justify-center" style={{ padding: '80px 0' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
                            {products.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 bg-gray-50 rounded-3xl" style={{ padding: '80px' }}>
                            <ShoppingBag size={48} className="text-gray-300" style={{ margin: '0 auto 16px' }} />
                            <p className="text-lg font-medium">No products available yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden" style={{ padding: '100px 0' }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }} className="relative z-10">
                    <div className="text-center" style={{ marginBottom: '64px' }}>
                        <span className="inline-block bg-white/10 text-purple-200 text-sm font-bold uppercase tracking-wider rounded-full backdrop-blur-sm" style={{ padding: '8px 20px', marginBottom: '16px' }}>
                            Testimonials
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '16px' }}>
                            What Our Customers Say
                        </h2>
                        <p className="text-purple-300 max-w-2xl" style={{ margin: '0 auto' }}>
                            Trusted by thousands of e-commerce sellers and businesses across India
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3" style={{ gap: '24px' }}>
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/15 transition-all" style={{ padding: '32px' }}>
                                {/* Stars */}
                                <div className="flex" style={{ marginBottom: '20px', gap: '4px' }}>
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <Star key={j} size={18} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-white/90 leading-relaxed" style={{ marginBottom: '24px' }}>
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center" style={{ gap: '12px' }}>
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-purple-900 font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{testimonial.name}</div>
                                        <div className="text-sm text-purple-300">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white" style={{ padding: '100px 0' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
                    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl relative overflow-hidden" style={{ padding: '80px 48px' }}>
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/30 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: '16px' }}>
                                Need Bulk Packaging?
                            </h2>
                            <p className="text-purple-200 text-lg max-w-lg" style={{ margin: '0 auto 32px' }}>
                                Get special wholesale prices for large orders. Contact us for custom quotes and exclusive deals.
                            </p>
                            <div className="flex flex-wrap justify-center" style={{ gap: '16px' }}>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 font-bold rounded-full shadow-lg transition-all"
                                    style={{ gap: '8px', padding: '18px 36px' }}
                                >
                                    Browse Products
                                    <ArrowRight size={20} />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full border border-white/30 transition-all"
                                    style={{ gap: '8px', padding: '18px 36px' }}
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
