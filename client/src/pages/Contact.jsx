import { useState } from 'react';
import { Mail, Phone, Clock, ArrowRight, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { contactsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await contactsAPI.submit(formData);
            setSubmitted(true);
            toast.success('Message sent successfully!');
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white">
            {/* Hero Section */}
            <div style={{ paddingTop: '120px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <div className="grid lg:grid-cols-2 items-start" style={{ gap: '60px' }}>

                        {/* Left Section - Contact Info */}
                        <div className="animate-fade-in">
                            {/* Heading with decorative line */}
                            <div style={{ marginBottom: '32px' }}>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ lineHeight: '1.2' }}>
                                    Get in{' '}
                                    <span className="inline-flex items-center">
                                        <span className="w-16 h-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ marginLeft: '12px', marginRight: '12px' }}></span>
                                    </span>
                                    <br />
                                    touch with us
                                </h1>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-lg" style={{ marginBottom: '40px', maxWidth: '450px', lineHeight: '1.7' }}>
                                We're here to help! Whether you have a question about our packaging supplies,
                                need assistance with your order, or want to provide feedback, our team is ready to assist you.
                            </p>

                            {/* Contact Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '48px' }}>
                                {/* Email */}
                                <div>
                                    <p className="text-gray-500 text-sm font-medium" style={{ marginBottom: '6px' }}>Email:</p>
                                    <a
                                        href="mailto:hello@lipmaterials.com"
                                        className="text-gray-900 text-xl font-semibold hover:text-purple-600 transition-colors"
                                    >
                                        hello@lipmaterials.com
                                    </a>
                                </div>

                                {/* Phone */}
                                <div>
                                    <p className="text-gray-500 text-sm font-medium" style={{ marginBottom: '6px' }}>Phone:</p>
                                    <a
                                        href="tel:+123456778"
                                        className="text-gray-900 text-xl font-semibold hover:text-purple-600 transition-colors"
                                    >
                                        +1 234 567 78
                                    </a>
                                    <p className="text-gray-500 text-sm" style={{ marginTop: '4px' }}>
                                        <Clock size={14} className="inline" style={{ marginRight: '6px' }} />
                                        Available Monday to Friday, 9 AM - 6 PM GMT
                                    </p>
                                </div>
                            </div>

                            {/* Live Chat Button */}
                            <button
                                className="group flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
                                style={{ padding: '14px 28px', gap: '12px' }}
                            >
                                <MessageCircle size={20} />
                                <span>Live Chat</span>
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <ArrowRight size={16} />
                                </div>
                            </button>
                        </div>

                        {/* Right Section - Contact Form */}
                        <div className="animate-slide-up">
                            <div
                                className="bg-white rounded-3xl shadow-xl shadow-gray-200/50"
                                style={{ padding: '40px' }}
                            >
                                {submitted ? (
                                    /* Success State */
                                    <div className="text-center" style={{ padding: '40px 0' }}>
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto" style={{ marginBottom: '24px' }}>
                                            <CheckCircle size={40} className="text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '12px' }}>
                                            Message Sent!
                                        </h3>
                                        <p className="text-gray-600" style={{ marginBottom: '24px' }}>
                                            Thank you for reaching out. We'll get back to you shortly.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    /* Contact Form */
                                    <form onSubmit={handleSubmit}>
                                        {/* Name Fields Row */}
                                        <div className="grid sm:grid-cols-2" style={{ gap: '20px', marginBottom: '20px' }}>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    placeholder="Enter your first name..."
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
                                                    style={{ padding: '14px 16px' }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    placeholder="Enter your last name..."
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
                                                    style={{ padding: '14px 16px' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Email Field */}
                                        <div style={{ marginBottom: '20px' }}>
                                            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email address..."
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
                                                style={{ padding: '14px 16px' }}
                                            />
                                        </div>

                                        {/* Message Field */}
                                        <div style={{ marginBottom: '28px' }}>
                                            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                                How can we help you?
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Enter your message..."
                                                rows={5}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all resize-none"
                                                style={{ padding: '14px 16px' }}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="group flex items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ padding: '14px 28px', gap: '12px' }}
                                            >
                                                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                                    {loading ? (
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <ArrowRight size={16} />
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info Section */}
            <div className="bg-white border-t border-gray-100" style={{ padding: '60px 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <div className="grid md:grid-cols-3" style={{ gap: '32px' }}>
                        {/* Quick Response */}
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform" style={{ marginBottom: '20px' }}>
                                <Send size={28} className="text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900" style={{ marginBottom: '8px' }}>
                                Quick Response
                            </h3>
                            <p className="text-gray-600 text-sm">
                                We respond to all inquiries within 24 hours during business days.
                            </p>
                        </div>

                        {/* Expert Support */}
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform" style={{ marginBottom: '20px' }}>
                                <Phone size={28} className="text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900" style={{ marginBottom: '8px' }}>
                                Expert Support
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Our packaging specialists are here to help you find the right solutions.
                            </p>
                        </div>

                        {/* Bulk Orders */}
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform" style={{ marginBottom: '20px' }}>
                                <Mail size={28} className="text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900" style={{ marginBottom: '8px' }}>
                                Bulk Orders
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Contact us for special pricing on large quantity orders.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
