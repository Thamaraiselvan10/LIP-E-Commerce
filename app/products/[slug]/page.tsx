'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { getProductById, getProductsByCategory } from '@/lib/products';
import { formatPrice, generateWhatsAppLink } from '@/lib/utils';
import { FaShoppingCart, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';

interface PageProps {
  params: { slug: string };
}

const categoryMap: Record<string, string> = {
  boxes: 'boxes',
  tapes: 'tapes',
  covers: 'covers',
};

const categoryTitles: Record<string, string> = {
  boxes: 'Packaging Boxes',
  tapes: 'Parcel Tapes',
  covers: 'Courier Covers',
};

export default function ProductPage({ params }: PageProps) {
  const slug = params.slug;
  const addItem = useCartStore((state) => state.addItem);

  // Check if it's a category
  const category = categoryMap[slug];
  if (category) {
    const products = getProductsByCategory(category);
    const title = categoryTitles[category] || 'Products';

    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  // Otherwise, treat it as a product ID
  const product = getProductById(slug);
  
  if (!product) {
    notFound();
  }

  const [selectedPackSize, setSelectedPackSize] = useState(product.packSizes[0]?.size || 0);
  const [selectedGsm, setSelectedGsm] = useState<number | undefined>(product.gsm?.[0]);
  const [quantity, setQuantity] = useState(1);

  const selectedPack = product.packSizes.find((p) => p.size === selectedPackSize);
  const price = selectedPack?.price || 0;
  const totalPrice = price * quantity;

  const handleAddToCart = () => {
    addItem({
      product,
      packSize: selectedPackSize,
      quantity,
      selectedGsm,
    });
    toast.success('Product added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/cart';
  };

  const handleWhatsApp = () => {
    const link = generateWhatsAppLink({
      productName: product.name,
      packSize: selectedPackSize,
      quantity,
      customOptions: {
        ...(selectedGsm && { GSM: selectedGsm }),
        ...(product.dimensions && {
          Dimensions: `${product.dimensions.length}" × ${product.dimensions.width}" × ${product.dimensions.height}"`,
        }),
      },
      message: 'I need custom specifications. Please provide a quote.',
    });
    window.open(link, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-4">
            <span className="text-6xl">📦</span>
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{product.description}</p>

          {/* Dimensions */}
          {product.dimensions && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Dimensions:</h3>
              <p className="text-gray-700">
                {product.dimensions.length}" × {product.dimensions.width}" × {product.dimensions.height}"
              </p>
            </div>
          )}

          {/* GSM Selector */}
          {product.gsm && product.gsm.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select GSM:</h3>
              <div className="flex gap-2">
                {product.gsm.map((gsm) => (
                  <button
                    key={gsm}
                    onClick={() => setSelectedGsm(gsm)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedGsm === gsm
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                    }`}
                  >
                    {gsm} GSM
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pack Size Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Pack Size:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {product.packSizes.map((pack) => (
                <button
                  key={pack.size}
                  onClick={() => setSelectedPackSize(pack.size)}
                  className={`p-3 rounded-lg border text-center ${
                    selectedPackSize === pack.size
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                  }`}
                >
                  <div className="font-semibold">{pack.size}</div>
                  <div className="text-sm">{formatPrice(pack.price)}</div>
                  {pack.discount && (
                    <div className="text-xs text-green-400">Save {pack.discount}%</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity:</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-primary-50 p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Pack Price:</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total ({quantity} packs):</span>
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
            <button
              onClick={handleWhatsApp}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaWhatsapp /> Custom Size
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <FaCheckCircle className="text-green-500" />
              <span>Prepaid orders only (No COD)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaCheckCircle className="text-green-500" />
              <span>GST invoice available</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaCheckCircle className="text-green-500" />
              <span>Bulk discounts available</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaCheckCircle className="text-green-500" />
              <span>Custom branding via WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

