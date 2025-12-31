'use client';

import { useCartStore } from '@/lib/store';
import { formatPrice, calculateGST } from '@/lib/utils';
import Link from 'next/link';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);

  const subtotal = getTotal();
  const gst = calculateGST(subtotal);
  const finalTotal = subtotal + gst;

  const handleQuantityChange = (productId: string, packSize: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, packSize);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(productId, packSize, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            href="/products/boxes"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => {
            const packPrice = item.product.packSizes.find(
              (p) => p.size === item.packSize
            )?.price || 0;
            const itemTotal = packPrice * item.quantity;

            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Pack of {item.packSize} • {formatPrice(packPrice)} per pack
                    </p>
                    {item.selectedGsm && (
                      <p className="text-xs text-gray-500">GSM: {item.selectedGsm}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.packSize,
                              item.quantity - 1
                            )
                          }
                          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                        >
                          <FaMinus />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.packSize,
                              item.quantity + 1
                            )
                          }
                          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">{formatPrice(itemTotal)}</span>
                        <button
                          onClick={() => {
                            removeItem(item.product.id, item.packSize);
                            toast.success('Item removed');
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST (18%):</span>
                <span>{formatPrice(gst)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Cash on Delivery (COD) is not available. Only prepaid orders are accepted.
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mb-4"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/products/boxes"
              className="block text-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

