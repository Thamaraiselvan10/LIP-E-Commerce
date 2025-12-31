'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: '',
    name: '',
  });
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOtp = async () => {
    if (!formData.phone && !formData.email) {
      toast.error('Please enter phone or email');
      return;
    }
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setShowOtp(true);
      setIsLoading(false);
      toast.success('OTP sent successfully!');
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      // Login logic
      if (!formData.email && !formData.phone) {
        toast.error('Please enter email or phone');
        setIsLoading(false);
        return;
      }
      if (!formData.password && !showOtp) {
        toast.error('Please enter password or request OTP');
        setIsLoading(false);
        return;
      }
      if (showOtp && !formData.otp) {
        toast.error('Please enter OTP');
        setIsLoading(false);
        return;
      }

      // Simulate login
      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify({
          email: formData.email || formData.phone,
          name: 'User',
          loggedIn: true,
        }));
        toast.success('Login successful!');
        router.push('/');
        setIsLoading(false);
      }, 1000);
    } else {
      // Signup logic
      if (!formData.name || !formData.phone || !formData.email) {
        toast.error('Please fill all required fields');
        setIsLoading(false);
        return;
      }
      if (!showOtp) {
        handleSendOtp();
        return;
      }
      if (!formData.otp) {
        toast.error('Please enter OTP');
        setIsLoading(false);
        return;
      }

      // Simulate signup
      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          loggedIn: true,
        }));
        toast.success('Account created successfully!');
        router.push('/');
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-700 mb-2">lip</h1>
            <p className="text-gray-600">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                isLogin
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                !isLogin
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isLogin ? 'Email or Phone' : 'Email'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={isLogin ? "text" : "email"}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={isLogin ? "Email or Phone" : "your@email.com"}
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>
            )}

            {!showOtp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {isLogin && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={isLogin}
                  />
                </div>
              </div>
            )}

            {showOtp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {isLogin && !showOtp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Login with OTP
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  {isLogin ? 'Login' : showOtp ? 'Verify & Sign Up' : 'Send OTP'}
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setShowOtp(false);
                  setFormData({ email: '', phone: '', password: '', otp: '', name: '' });
                }}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <Link
              href="/"
              className="block text-center text-sm text-gray-600 hover:text-primary-600"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

