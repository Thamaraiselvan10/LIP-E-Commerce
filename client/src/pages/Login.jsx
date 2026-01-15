import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight, Package } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            toast.success('Welcome back!');
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else {
                const redirectTo = searchParams.get('redirect') || '/';
                navigate(redirectTo);
            }
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center bg-white"
                style={{ padding: '32px' }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="w-full"
                    style={{ maxWidth: '400px' }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Logo */}
                    <motion.div variants={itemVariants}>
                        <Link to="/" className="flex items-center" style={{ gap: '10px', marginBottom: '40px' }}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <Package className="text-white" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                                    LIP Materials
                                </span>
                                <span className="text-[10px] text-amber-500 font-medium tracking-wider" style={{ marginTop: '-2px' }}>PACKAGING SUPPLIES</span>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div style={{ marginBottom: '32px' }} variants={itemVariants}>
                        <h1 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Welcome Back</h1>
                        <p className="text-gray-500">Sign in to access your account</p>
                    </motion.div>

                    <form onSubmit={handleSubmit}>
                        <motion.div style={{ marginBottom: '20px' }} variants={itemVariants}>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                Email Address
                            </label>
                            <motion.input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                style={{ padding: '14px 16px' }}
                                placeholder="you@example.com"
                                autoComplete="email"
                                whileFocus={{ scale: 1.01 }}
                            />
                        </motion.div>

                        <motion.div style={{ marginBottom: '20px' }} variants={itemVariants}>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                Password
                            </label>
                            <div className="relative">
                                <motion.input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    style={{ padding: '14px 48px 14px 16px' }}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    whileFocus={{ scale: 1.01 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div className="flex items-center justify-between" style={{ marginBottom: '24px' }} variants={itemVariants}>
                            <label className="flex items-center cursor-pointer" style={{ gap: '8px' }}>
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                Forgot password?
                            </Link>
                        </motion.div>

                        {error && (
                            <motion.div
                                className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl"
                                style={{ padding: '16px', marginBottom: '24px' }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: [0, -5, 5, -5, 0] }}
                                transition={{ duration: 0.4 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center"
                            style={{ padding: '16px', gap: '8px' }}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -15px rgba(147, 51, 234, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <motion.p className="text-center text-gray-500" style={{ marginTop: '32px' }} variants={itemVariants}>
                        Don't have an account?{' '}
                        <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                            Create one
                        </Link>
                    </motion.p>

                    {/* Demo Credentials */}
                    <motion.div
                        className="bg-purple-50 border border-purple-100 rounded-xl"
                        style={{ marginTop: '32px', padding: '16px' }}
                        variants={itemVariants}
                    >
                        <p className="text-xs text-purple-600 font-medium text-center" style={{ marginBottom: '12px' }}>Quick Demo Access</p>
                        <motion.button
                            type="button"
                            onClick={() => {
                                setEmail('admin@gmail.com');
                                setPassword('admin@123');
                            }}
                            className="w-full bg-white border border-purple-200 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-50 transition-colors"
                            style={{ padding: '10px 16px' }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Fill Admin Credentials
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => {
                                setEmail('customer@gmail.com');
                                setPassword('admin@123');
                            }}
                            className="w-full bg-white border border-purple-200 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-50 transition-colors mt-2"
                            style={{ padding: '10px 16px' }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Fill Customer Credentials
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Right Side - Decorative */}
            <motion.div
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden items-center justify-center"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"
                        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
                        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

                <motion.div
                    className="relative z-10 text-center"
                    style={{ padding: '48px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <motion.div
                        className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-center"
                        style={{ margin: '0 auto 32px' }}
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Package size={40} className="text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white" style={{ marginBottom: '16px' }}>Premium Packaging</h2>
                    <p className="text-purple-200/80" style={{ maxWidth: '320px', margin: '0 auto' }}>
                        Access your dashboard to manage products, orders, and grow your packaging business.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
