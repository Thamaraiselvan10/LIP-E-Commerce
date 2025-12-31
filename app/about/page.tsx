import { FaCheckCircle, FaUsers, FaAward, FaHandshake } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About LIP Packaging</h1>

        <div className="prose max-w-none mb-12">
          <p className="text-lg text-gray-700 mb-6">
            LIP Packaging is a leading provider of premium packaging solutions for businesses across India. 
            We specialize in manufacturing and supplying high-quality boxes, parcel tapes, and courier covers 
            to meet the diverse needs of e-commerce businesses, retailers, and manufacturers.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            To provide businesses with reliable, cost-effective packaging solutions that protect their products 
            while enhancing their brand image. We believe in quality, affordability, and exceptional customer service.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start gap-4">
              <FaCheckCircle className="text-3xl text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-700">
                  We use only the finest materials and follow strict quality control measures to ensure 
                  your products are well-protected during shipping.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaAward className="text-3xl text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Bulk Pricing</h3>
                <p className="text-gray-700">
                  Special discounts for bulk orders. The more you buy, the more you save on your packaging costs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaHandshake className="text-3xl text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Custom Branding</h3>
                <p className="text-gray-700">
                  Get your logo and branding printed on boxes and tapes. We offer custom printing services 
                  to help you stand out.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaUsers className="text-3xl text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                <p className="text-gray-700">
                  Our team is always ready to help you find the perfect packaging solution for your needs. 
                  Contact us via WhatsApp for instant support.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-8 mb-4">Our Products</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Self-Lock Boxes:</strong> Easy-to-assemble boxes that require no tape</li>
            <li><strong>Corrugated Boxes:</strong> Strong and durable boxes for heavy items</li>
            <li><strong>Parcel Tapes:</strong> High-quality tapes in various types and sizes</li>
            <li><strong>Courier Covers:</strong> Branded covers for major e-commerce platforms</li>
          </ul>

          <h2 className="text-3xl font-bold mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            Have questions or need custom packaging solutions? We're here to help!
          </p>
          <p className="text-gray-700">
            Reach out to us via WhatsApp for instant support and custom quotes.
          </p>
        </div>
      </div>
    </div>
  );
}

