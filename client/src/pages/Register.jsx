import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, User, Mail, Lock, Package } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const { register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/');
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/30 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

                <div className="relative z-10 text-center" style={{ padding: '48px' }}>
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-center animate-float" style={{ margin: '0 auto 32px' }}>
                        <Package size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white" style={{ marginBottom: '16px' }}>Join LIP Materials</h2>
                    <p className="text-purple-200/80" style={{ maxWidth: '320px', margin: '0 auto' }}>
                        Create an account to explore our premium packaging collection and enjoy exclusive offers.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white" style={{ padding: '32px' }}>
                <div className="w-full" style={{ maxWidth: '400px' }}>
                    {/* Logo */}
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

                    <div style={{ marginBottom: '32px' }}>
                        <h1 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Create Account</h1>
                        <p className="text-gray-500">Get started with your free account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    style={{ padding: '14px 16px 14px 48px' }}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    style={{ padding: '14px 16px 14px 48px' }}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    style={{ padding: '14px 48px 14px 48px' }}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    style={{ padding: '14px 16px 14px 48px' }}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl" style={{ padding: '16px', marginBottom: '24px' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center"
                            style={{ padding: '16px', gap: '8px' }}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500" style={{ marginTop: '32px' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                            Sign in
                        </Link>
                    </p>

                    <p className="text-center text-xs text-gray-400" style={{ marginTop: '24px' }}>
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-purple-500 hover:underline">Terms</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-purple-500 hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
