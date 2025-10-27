import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-center min-h-[60vh] flex flex-col justify-center items-center">
      <svg className="w-24 h-24 text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
      <p className="text-xl text-gray-600 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>
      <Link to="/" className="bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;
