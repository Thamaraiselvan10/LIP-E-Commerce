import Link from 'next/link';
import { FaBox, FaTape, FaEnvelope, FaCheckCircle, FaStar, FaWhatsapp } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

export default function Home() {
  const featuredProducts = products.slice(0, 6);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Packaging Solutions for Your Business
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Quality boxes, tapes, and courier covers with bulk pricing and custom branding options
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products/boxes"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Shop Now
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaWhatsapp /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Product Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/products/boxes" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                <FaBox className="text-5xl text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-semibold mb-2">Boxes</h3>
                <p className="text-gray-600">
                  Self-lock and corrugated boxes in various sizes with GSM options
                </p>
              </div>
            </Link>
            <Link href="/products/tapes" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                <FaTape className="text-5xl text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-semibold mb-2">Parcel Tapes</h3>
                <p className="text-gray-600">
                  Plain, branded, and custom printed tapes for all your packaging needs
                </p>
              </div>
            </Link>
            <Link href="/products/covers" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                <FaEnvelope className="text-5xl text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-semibold mb-2">Courier Covers</h3>
                <p className="text-gray-600">
                  Branded courier covers for Meesho, Amazon, Flipkart, and more
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products/boxes" className="text-primary-600 hover:text-primary-700 font-semibold">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose LIP */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LIP Packaging?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                We use only the finest materials to ensure your products are well-protected during shipping.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bulk Pricing</h3>
              <p className="text-gray-600">
                Special discounts for bulk orders. The more you buy, the more you save!
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Branding</h3>
              <p className="text-gray-600">
                Get your logo and branding printed on boxes and tapes. Contact us via WhatsApp for quotes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Special Bulk Offers</h2>
          <p className="text-xl mb-8">Buy 1000+ units and save up to 15%</p>
          <Link
            href="/products/boxes"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors inline-block"
          >
            Explore Bulk Deals
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Excellent quality boxes and fast delivery. The bulk pricing helped us save a lot on our packaging costs."
                </p>
                <p className="font-semibold">- Business Owner</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-green-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <FaWhatsapp className="text-5xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Need Custom Sizes or Bulk Quotes?</h2>
          <p className="text-xl mb-8">Chat with us on WhatsApp for instant support</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-500 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
          >
            Message Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

