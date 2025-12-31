'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/utils';
import { FaSearch, FaCheckCircle, FaClock, FaTruck, FaBox } from 'react-icons/fa';
import toast from 'react-hot-toast';

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  confirmed: {
    label: 'Order Confirmed',
    icon: <FaCheckCircle />,
    color: 'text-blue-600',
  },
  in_production: {
    label: 'In Production',
    icon: <FaClock />,
    color: 'text-yellow-600',
  },
  dispatched: {
    label: 'Dispatched',
    icon: <FaTruck />,
    color: 'text-purple-600',
  },
  delivered: {
    label: 'Delivered',
    icon: <FaBox />,
    color: 'text-green-600',
  },
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!orderId.trim() || !phone.trim()) {
      toast.error('Please enter both Order ID and Phone Number');
      return;
    }

    setIsSearching(true);

    // Search in localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(
      (o: Order) => o.orderId === orderId && o.customer.phone === phone.replace(/\D/g, '')
    );

    setTimeout(() => {
      setIsSearching(false);
      if (foundOrder) {
        setOrder(foundOrder);
        toast.success('Order found!');
      } else {
        setOrder(null);
        toast.error('Order not found. Please check your Order ID and Phone Number.');
      }
    }, 500);
  };

  const getStatusSteps = (currentStatus: OrderStatus) => {
    const allStatuses: OrderStatus[] = ['confirmed', 'in_production', 'dispatched', 'delivered'];
    const currentIndex = allStatuses.indexOf(currentStatus);

    return allStatuses.map((status, index) => {
      const config = statusConfig[status];
      const isActive = index <= currentIndex;
      const isCurrent = index === currentIndex;

      return (
        <div key={status} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isActive
                  ? isCurrent
                    ? 'bg-primary-600 text-white'
                    : 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {config.icon}
            </div>
            <p className={`text-xs mt-2 text-center ${isActive ? 'font-semibold' : 'text-gray-400'}`}>
              {config.label}
            </p>
          </div>
          {index < allStatuses.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 ${
                index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Track Your Order</h1>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              placeholder="LIP-12345678-123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FaSearch /> {isSearching ? 'Searching...' : 'Track Order'}
          </button>
        </div>
      </div>

      {/* Order Details */}
      {order && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Order {order.orderId}</h2>
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatPrice(order.finalTotal)}
                </p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Status</h3>
              <div className="flex items-center">{getStatusSteps(order.status)}</div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => {
                  const packPrice = item.product.packSizes.find(
                    (p) => p.size === item.packSize
                  )?.price || 0;
                  return (
                    <div key={index} className="flex justify-between items-center border-b pb-3">
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
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="text-gray-700">
                <p className="font-semibold">{order.customer.fullName}</p>
                <p>{order.customer.address}</p>
                <p>
                  {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                </p>
                <p>{order.customer.country}</p>
                <p className="mt-2">Phone: {order.customer.phone}</p>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold mb-1">Tracking Number:</p>
                <p className="font-mono">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

