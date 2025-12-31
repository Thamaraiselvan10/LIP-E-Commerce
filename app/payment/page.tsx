'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';
import { FaQrcode, FaCheckCircle, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay'>('upi');
  const [upiId, setUpiId] = useState('lip.packaging@paytm');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');

  useEffect(() => {
    if (!orderId) {
      router.push('/cart');
      return;
    }

    // Load order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.orderId === orderId);
    
    if (!foundOrder) {
      toast.error('Order not found');
      router.push('/cart');
      return;
    }

    setOrder(foundOrder);
  }, [orderId, router]);

  const handlePayment = async () => {
    if (!order) return;

    // In a real app, you would integrate with Razorpay or UPI payment gateway
    // For demo purposes, we'll simulate payment success
    toast.success('Processing payment...');
    
    setTimeout(() => {
      // Update order status
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.map((o: Order) =>
        o.orderId === orderId
          ? { ...o, paymentStatus: 'completed', status: 'confirmed' }
          : o
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      setPaymentStatus('completed');
      toast.success('Payment successful!');
      
      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${orderId}`);
      }, 2000);
    }, 2000);
  };

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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Payment</h1>

        {paymentStatus === 'pending' ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Order ID: {order.orderId}</h2>
              <p className="text-gray-600">Amount to Pay: {formatPrice(order.finalTotal)}</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Important:</strong> Cash on Delivery (COD) is not available. Only prepaid orders are accepted.
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 border-2 rounded-lg text-center ${
                    paymentMethod === 'upi'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  <FaQrcode className="text-3xl mx-auto mb-2" />
                  <span className="font-semibold">UPI</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 border-2 rounded-lg text-center ${
                    paymentMethod === 'razorpay'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  <span className="text-3xl mx-auto mb-2 block">💳</span>
                  <span className="font-semibold">Razorpay</span>
                </button>
              </div>
            </div>

            {/* UPI Payment */}
            {paymentMethod === 'upi' && (
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-lg">
                      <FaQrcode className="text-6xl text-gray-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Scan QR Code or Pay to UPI ID</p>
                    <div className="bg-white p-3 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="font-mono font-semibold">{upiId}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      After payment, click "Confirm Payment" below
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Razorpay Payment */}
            {paymentMethod === 'razorpay' && (
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-center text-gray-600 mb-4">
                    You will be redirected to Razorpay payment gateway
                  </p>
                  <p className="text-xs text-center text-gray-500">
                    Note: Razorpay integration requires API keys. This is a demo.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handlePayment}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {paymentMethod === 'upi' ? 'Confirm Payment' : 'Proceed to Razorpay'}
            </button>
          </div>
        ) : paymentStatus === 'completed' ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your order {order.orderId} has been confirmed.
            </p>
            <p className="text-sm text-gray-500">Redirecting to order confirmation...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaTimes className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              Please try again or contact support.
            </p>
            <button
              onClick={() => setPaymentStatus('pending')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

