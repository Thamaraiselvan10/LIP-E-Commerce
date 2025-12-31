'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaShoppingCart, FaWhatsapp, FaBars, FaTimes, FaUser, FaTag } from 'react-icons/fa';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products/boxes', label: 'Boxes' },
    { href: '/products/tapes', label: 'Tapes' },
    { href: '/products/covers', label: 'Courier Covers' },
    { href: '/offers', label: 'Offers', icon: <FaTag className="text-xs" /> },
    { href: '/track-order', label: 'Track Order' },
  ];

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-800 bg-clip-text text-transparent">
              lip
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Offers Badge */}
            <Link
              href="/offers"
              className="hidden md:flex items-center space-x-1 text-gold-600 hover:text-gold-700 font-semibold"
            >
              <FaTag />
              <span className="text-sm">Offers</span>
            </Link>

            {/* WhatsApp Button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="text-lg" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <FaUser className="text-xl" />
                    <span className="hidden md:inline text-sm font-medium">{user.name || 'Account'}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <Link
                        href="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/addresses"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        Saved Addresses
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('user');
                          setUser(null);
                          setShowUserMenu(false);
                          window.location.href = '/';
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <FaUser className="text-xl" />
                  <span className="hidden md:inline text-sm font-medium">Login</span>
                </Link>
              )}
            </div>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FaShoppingCart className="text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="hidden md:inline text-sm font-medium">Cart</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary-600"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                    pathname === link.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {link.icon && link.icon}
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                >
                  Login
                </Link>
              )}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors mt-2"
              >
                <FaWhatsapp className="text-lg" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

