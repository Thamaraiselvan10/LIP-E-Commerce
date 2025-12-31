'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { FaBox, FaShoppingCart, FaUsers, FaRupeeSign, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
    
    // Calculate stats
    const totalRevenue = storedOrders
      .filter((o: Order) => o.paymentStatus === 'completed')
      .reduce((sum: number, o: Order) => sum + o.finalTotal, 0);
    
    const pendingOrders = storedOrders.filter(
      (o: Order) => o.paymentStatus === 'pending' || o.status !== 'delivered'
    ).length;
    
    const completedOrders = storedOrders.filter(
      (o: Order) => o.status === 'delivered'
    ).length;

    setStats({
      totalOrders: storedOrders.length,
      totalRevenue,
      pendingOrders,
      completedOrders,
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map((o) =>
      o.orderId === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    loadOrders();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Link
          href="/"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Back to Website
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <FaShoppingCart className="text-4xl text-primary-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <FaRupeeSign className="text-4xl text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <FaBox className="text-4xl text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold">{stats.completedOrders}</p>
            </div>
            <FaUsers className="text-4xl text-blue-600" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Payment</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{order.orderId}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold">{order.customer.fullName}</p>
                        <p className="text-sm text-gray-600">{order.customer.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">{formatPrice(order.finalTotal)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.orderId, e.target.value as Order['status'])}
                        className="px-3 py-1 border rounded-lg text-sm"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="in_production">In Production</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary-600 hover:text-primary-700 mr-2"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <p>Order ID: {selectedOrder.orderId}</p>
                  <p>Date: {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
                  <p>Status: {selectedOrder.status}</p>
                  <p>Payment: {selectedOrder.paymentStatus}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p>Name: {selectedOrder.customer.fullName}</p>
                  <p>Phone: {selectedOrder.customer.phone}</p>
                  <p>Email: {selectedOrder.customer.email}</p>
                  <p>Address: {selectedOrder.customer.address}</p>
                  <p>
                    {selectedOrder.customer.city}, {selectedOrder.customer.state} -{' '}
                    {selectedOrder.customer.pincode}
                  </p>
                  {selectedOrder.customer.companyName && (
                    <p>Company: {selectedOrder.customer.companyName}</p>
                  )}
                  {selectedOrder.customer.gstNumber && (
                    <p>GST: {selectedOrder.customer.gstNumber}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  {selectedOrder.items.map((item, index) => {
                    const packPrice = item.product.packSizes.find(
                      (p) => p.size === item.packSize
                    )?.price || 0;
                    return (
                      <div key={index} className="border-b pb-2 mb-2">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Pack of {item.packSize} × {item.quantity} = {formatPrice(packPrice * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Payment Summary</h3>
                  <p>Subtotal: {formatPrice(selectedOrder.total)}</p>
                  <p>GST (18%): {formatPrice(selectedOrder.gst)}</p>
                  <p className="text-xl font-bold">Total: {formatPrice(selectedOrder.finalTotal)}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

