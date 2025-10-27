import React from 'react';
import { useAuth } from '@/context/AuthContext.jsx';

const OrderHistory = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your order history.</h2>
      </div>
    );
  }

  // Dummy order data for demonstration
  const dummyOrders = [
    {
      id: 'ORD001',
      date: '2024-08-15',
      total: 129.98,
      items: [
        { name: 'Organic Cotton T-Shirt', quantity: 1, price: 24.99 },
        { name: 'Slim Fit Chinos', quantity: 1, price: 49.99 },
        { name: 'Classic Denim Jacket', quantity: 1, price: 79.99 },
      ],
    },
    {
      id: 'ORD002',
      date: '2024-07-20',
      total: 89.99,
      items: [
        { name: 'White Sneakers', quantity: 1, price: 89.99 },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Order History for {user?.name || 'User'}</h1>

      {dummyOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You have no past orders.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {dummyOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">Order #{order.id}</h2>
                <span className="text-gray-600">Date: {order.date}</span>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-700">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;