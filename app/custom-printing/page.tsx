'use client';

import { useState } from 'react';
import { FaPrint, FaPalette, FaImage, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import { generateWhatsAppLink } from '@/lib/utils';

export default function CustomPrintingPage() {
  const [formData, setFormData] = useState({
    productType: '',
    quantity: '',
    printType: '',
    designType: '',
    colors: '',
    logoFile: null as File | null,
    requirements: '',
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, logoFile: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = generateWhatsAppLink({
      productName: formData.productType,
      quantity: parseInt(formData.quantity) || undefined,
      customOptions: {
        'Print Type': formData.printType,
        'Design Type': formData.designType,
        'Colors': formData.colors,
        'Company': formData.companyName,
        'Contact': formData.contactName,
      },
      message: formData.requirements || 'I need custom printing services. Please provide a quote.',
    });
    window.open(link, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FaPrint className="text-6xl text-primary-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-800 bg-clip-text text-transparent">
            Custom Printing & Branding
          </h1>
          <p className="text-xl text-gray-600">
            Get your logo, brand name, or custom designs printed on boxes and tapes
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
                  <option value="">Select Product</option>
                  <option value="Boxes">Boxes (Self-Lock / Corrugated)</option>
                  <option value="Parcel Tapes">Parcel Tapes</option>
                  <option value="Courier Covers">Courier Covers</option>
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
                    min="500"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Minimum 500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Print Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="printType"
                    value={formData.printType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Logo Only">Logo Only</option>
                    <option value="Text Only">Text Only</option>
                    <option value="Logo + Text">Logo + Text</option>
                    <option value="Full Design">Full Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Type
                </label>
                <select
                  name="designType"
                  value={formData.designType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Design Type</option>
                  <option value="Single Color">Single Color</option>
                  <option value="Multi Color">Multi Color</option>
                  <option value="CMYK Full Color">CMYK Full Color</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Colors
                </label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 1, 2, 3, or Full Color"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo/Design (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Click to upload
                  </label>
                  {formData.logoFile && (
                    <p className="text-sm text-gray-600 mt-2">{formData.logoFile.name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF up to 10MB</p>
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
                  Special Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your printing requirements, placement preferences, or any special instructions..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FaWhatsapp className="text-xl" />
                Get Custom Printing Quote
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-600 to-purple-700 rounded-2xl p-6 text-white">
              <FaPalette className="text-4xl mb-4" />
              <h3 className="text-xl font-bold mb-4">Printing Options</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>Logo printing (1-4 colors)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>Text & branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>Full-color CMYK printing</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>Custom designs</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" />
                  <span>Multiple placement options</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Minimum Order</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Boxes:</span>
                  <span className="font-semibold">500 units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tapes:</span>
                  <span className="font-semibold">1000 units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Covers:</span>
                  <span className="font-semibold">1000 units</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Custom printing requires artwork approval before production. 
                We'll send you a proof for approval before printing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

