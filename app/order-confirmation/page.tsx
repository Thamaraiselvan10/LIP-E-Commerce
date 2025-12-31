'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { FaCheckCircle, FaDownload, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Load order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.orderId === orderId);
    
    if (!foundOrder) {
      router.push('/');
      return;
    }

    setOrder(foundOrder);
    clearCart(); // Clear cart after successful order
  }, [orderId, router, clearCart]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>
          <div className="bg-primary-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-2xl font-bold text-primary-600">{order.orderId}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Order Details</h2>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => {
              const packPrice = item.product.packSizes.find(
                (p) => p.size === item.packSize
              )?.price || 0;
              return (
                <div key={index} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Pack of {item.packSize} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(packPrice * item.quantity)}</p>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%):</span>
              <span>{formatPrice(order.gst)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-primary-600">{formatPrice(order.finalTotal)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
          <div className="text-gray-700">
            <p className="font-semibold">{order.customer.fullName}</p>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.city}, {order.customer.state} - {order.customer.pincode}
            </p>
            <p>{order.customer.country}</p>
            <p className="mt-2">Phone: {order.customer.phone}</p>
            <p>Email: {order.customer.email}</p>
            {order.customer.companyName && (
              <p className="mt-2">Company: {order.customer.companyName}</p>
            )}
            {order.customer.gstNumber && (
              <p>GST: {order.customer.gstNumber}</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>You will receive an order confirmation email shortly</li>
            <li>We'll notify you when your order is in production</li>
            <li>You'll receive tracking information once your order is dispatched</li>
            <li>Expected delivery: 5-7 business days</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/track-order"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            Track Order
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaDownload /> Download Invoice
          </button>
          <Link
            href="/"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <FaHome /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

