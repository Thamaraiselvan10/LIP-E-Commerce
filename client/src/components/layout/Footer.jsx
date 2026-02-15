import { Link } from 'react-router-dom';
import { Package, Send, Mail } from 'lucide-react';

// Social Media Icons adjusted for dark theme availability (using Lucide where possible or SVG)
const XIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const productLinks = [
        { name: 'Cardboard Boxes', link: '/products?category=boxes' },
        { name: 'Courier Covers', link: '/products?category=covers' },
        { name: 'Packaging Tapes', link: '/products?category=tapes' },
        { name: 'All Products', link: '/products' },
    ];

    const quickLinks = [
        { name: 'About Us', link: '/about' },
        { name: 'Contact Us', link: '/contact' },
        { name: 'FAQ', link: '/faq' },
        { name: 'Shipping Info', link: '/shipping-info' },
    ];

    const companyLinks = [
        { name: 'Carrers', link: '/careers' },
        { name: 'Privacy Policy', link: '/privacy' },
        { name: 'Terms of Service', link: '/terms' },
    ];

    return (
        <footer role="contentinfo" aria-label="Site footer" className="bg-slate-900 border-t border-slate-800 text-slate-300">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">

                {/* Top Section: Brand + Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 border-b border-slate-800 pb-12">
                    <div className="lg:col-span-5 flex flex-col items-start">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
                                <Package className="text-white" size={20} />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">LIP Materials</span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
                            Premium packaging solutions that elevate your brand. From sturdy boxes to custom tapes, we wrap your products in quality.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all transform hover:-translate-y-1" aria-label="X (Twitter)">
                                <XIcon />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-pink-500 transition-all transform hover:-translate-y-1" aria-label="Instagram">
                                <InstagramIcon />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-blue-500 transition-all transform hover:-translate-y-1" aria-label="LinkedIn">
                                <LinkedInIcon />
                            </a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-7 lg:pl-12">
                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-semibold text-white mb-2">Join our newsletter</h3>
                                <p className="text-slate-400 mb-6">Get 10% off your first bulk order and stay updated with new products.</p>
                                <form className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-slate-500 transition-all"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-lg shadow-purple-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        Subscribe
                                        <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    <div>
                        <h4 className="text-white font-semibold mb-6">Products</h4>
                        <ul className="flex flex-col gap-3">
                            {productLinks.map((item) => (
                                <li key={item.name}>
                                    <Link to={item.link} className="text-slate-400 hover:text-purple-400 transition-colors text-sm font-medium">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-6">Support</h4>
                        <ul className="flex flex-col gap-3">
                            {quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link to={item.link} className="text-slate-400 hover:text-purple-400 transition-colors text-sm font-medium">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="flex flex-col gap-3">
                            {companyLinks.map((item) => (
                                <li key={item.name}>
                                    <Link to={item.link} className="text-slate-400 hover:text-purple-400 transition-colors text-sm font-medium">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact</h4>
                        <ul className="flex flex-col gap-3 text-sm text-slate-400">
                            <li>123 Packaging Street</li>
                            <li>Industrial Estate, City</li>
                            <li>contact@lipmaterials.com</li>
                            <li>+1 (555) 123-4567</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm order-2 md:order-1">
                        © {currentYear} LIP Materials. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 order-1 md:order-2">
                        <Link to="/privacy" className="text-slate-500 hover:text-purple-400 text-sm transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-slate-500 hover:text-purple-400 text-sm transition-colors">Terms</Link>
                        <Link to="/cookies" className="text-slate-500 hover:text-purple-400 text-sm transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
