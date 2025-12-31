'use client';

import { useState } from 'react';
import { FaBox, FaWhatsapp, FaCheckCircle, FaCalculator } from 'react-icons/fa';
import { generateWhatsAppLink } from '@/lib/utils';

export default function BulkOrderPage() {
  const [formData, setFormData] = useState({
    productType: '',
    quantity: '',
    gsm: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    customRequirements: '',
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('dimensions.')) {
      const dimKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dimKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = generateWhatsAppLink({
      productName: formData.productType,
      quantity: parseInt(formData.quantity) || undefined,
      customOptions: {
        GSM: formData.gsm,
        Dimensions: `${formData.dimensions.length}" × ${formData.dimensions.width}" × ${formData.dimensions.height}"`,
        Company: formData.companyName,
        Contact: formData.contactName,
      },
      message: formData.customRequirements || 'I need a bulk order quote. Please provide pricing and delivery details.',
    });
    window.open(link, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-800 bg-clip-text text-transparent">
            Bulk Order Inquiry
          </h1>
          <p className="text-xl text-gray-600">
            Get custom pricing for bulk orders (100+ units). Fill the form below and we'll send you a quote via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Product Type</option>
                  <option value="Self-Lock Boxes">Self-Lock Boxes</option>
                  <option value="Corrugated Boxes">Corrugated Boxes</option>
                  <option value="Parcel Tapes">Parcel Tapes</option>
                  <option value="Courier Covers">Courier Covers</option>
                  <option value="Custom Printing">Custom Printing</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Minimum 100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GSM (for boxes)
                  </label>
                  <input
                    type="text"
                    name="gsm"
                    value={formData.gsm}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="200, 250, 300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (L × W × H in inches)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Length"
                  />
                  <input
                    type="number"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Width"
                  />
                  <input
                    type="number"
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Height"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Requirements
                </label>
                <textarea
                  name="customRequirements"
                  value={formData.customRequirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any special requirements, branding needs, or delivery preferences..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FaWhatsapp className="text-xl" />
                Get Quote via WhatsApp
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-600 to-purple-700 rounded-2xl p-6 text-white">
              <FaBox className="text-4xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Bulk Order Benefits</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>Up to 20% discount on bulk orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>Custom sizing and branding available</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>Priority production and shipping</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>GST invoice provided</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <FaCalculator className="text-3xl text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">Pricing Calculator</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">100-499 units:</span>
                  <span className="font-semibold">5% OFF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">500-999 units:</span>
                  <span className="font-semibold">10% OFF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">1000+ units:</span>
                  <span className="font-semibold text-gold-600">15-20% OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

