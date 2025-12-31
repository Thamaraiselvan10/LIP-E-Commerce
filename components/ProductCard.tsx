'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { FaShoppingCart, FaWhatsapp } from 'react-icons/fa';
import { useCartStore } from '@/lib/store';
import { generateWhatsAppLink } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const smallestPack = product.packSizes[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product,
      packSize: smallestPack.size,
      quantity: 1,
    });
    toast.success('Product added to cart!');
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = generateWhatsAppLink({
      productName: product.name,
      message: `I'm interested in ${product.name}. Please provide more details.`,
    });
    window.open(link, '_blank');
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
        <div className="relative h-48 bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-4xl">📦</span>
          </div>
          {!product.inStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          {product.dimensions && (
            <p className="text-xs text-gray-500 mb-2">
              Size: {product.dimensions.length}" × {product.dimensions.width}" × {product.dimensions.height}"
            </p>
          )}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {formatPrice(smallestPack.price)}
              </p>
              <p className="text-xs text-gray-500">Pack of {smallestPack.size}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleWhatsApp}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

