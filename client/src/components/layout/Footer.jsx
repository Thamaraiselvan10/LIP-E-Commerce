import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Package, ArrowRight } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer role="contentinfo" aria-label="Site footer" className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            {/* Newsletter Section */}
            <div className="border-b border-gray-800/50">
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px' }}>
                    <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/30 rounded-2xl backdrop-blur-sm border border-purple-500/20" style={{ padding: '32px 48px' }}>
                        <div className="flex flex-col md:flex-row items-center justify-between" style={{ gap: '24px' }}>
                            <div>
                                <h3 className="text-2xl font-bold text-white" style={{ marginBottom: '8px' }}>Get Exclusive Deals</h3>
                                <p className="text-gray-400">Subscribe for wholesale prices and new product updates</p>
                            </div>
                            <div className="flex w-full md:w-auto" style={{ gap: '8px' }}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    aria-label="Email address for newsletter"
                                    className="flex-1 md:w-64 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                                    style={{ padding: '12px 16px' }}
                                />
                                <button aria-label="Subscribe to newsletter" className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-semibold rounded-xl whitespace-nowrap transition-all" style={{ padding: '12px 20px' }}>
                                    Subscribe
                                    <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px' }} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 32px' }} className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '48px' }}>
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center" style={{ gap: '10px', marginBottom: '24px' }}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                                <Package className="text-white" size={20} />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">LIP Materials</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 leading-relaxed" style={{ marginBottom: '24px' }}>
                            Your one-stop shop for quality packaging supplies.
                            Cardboard boxes, courier covers, and tapes at wholesale prices.
                        </p>
                        <div className="flex" style={{ gap: '12px' }}>
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-purple-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-lg font-semibold text-white" style={{ marginBottom: '24px' }}>Products</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { name: 'Cardboard Boxes', link: '/products?category=boxes' },
                                { name: 'Courier Covers', link: '/products?category=covers' },
                                { name: 'Packaging Tapes', link: '/products?category=tapes' },
                                { name: 'All Products', link: '/products' },
                                { name: 'Bulk Orders', link: '/contact' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.link}
                                        className="text-gray-400 hover:text-amber-400 transition-colors flex items-center group"
                                        style={{ gap: '8px' }}
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 transition-all duration-300"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white" style={{ marginBottom: '24px' }}>Quick Links</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['About Us', 'Contact', 'FAQ', 'Shipping Info', 'Returns Policy'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={`/${item.toLowerCase().replace(/[\s]/g, '-')}`}
                                        className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group"
                                        style={{ gap: '8px' }}
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold text-white" style={{ marginBottom: '24px' }}>Contact Us</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li className="flex items-start" style={{ gap: '12px' }}>
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={18} className="text-purple-400" />
                                </div>
                                <span className="text-gray-400">123 Industrial Area, Chennai, Tamil Nadu, India</span>
                            </li>
                            <li className="flex items-center" style={{ gap: '12px' }}>
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <Phone size={18} className="text-purple-400" />
                                </div>
                                <span className="text-gray-400">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center" style={{ gap: '12px' }}>
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <Mail size={18} className="text-purple-400" />
                                </div>
                                <span className="text-gray-400">info@packmart.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between" style={{ marginTop: '64px', paddingTop: '32px', gap: '16px' }}>
                    <p className="text-gray-500 text-sm">
                        © {currentYear} LIP Materials. All rights reserved.
                    </p>
                    <div className="flex items-center text-sm text-gray-500" style={{ gap: '24px' }}>
                        <Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-purple-400 transition-colors">Terms</Link>
                        <Link to="/cookies" className="hover:text-purple-400 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
