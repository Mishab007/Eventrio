import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.address || 
        !formData.city || !formData.zip || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (formData.paymentMethod === 'credit' && 
        (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) {
      alert('Please fill in all payment details');
      return;
    }

    // Simulate payment processing
    const newOrderId = 'ORD-' + Date.now();
    setOrderId(newOrderId);
    setOrderPlaced(true);
    clearCart(); // Clear cart after successful order
  };

  const calculateShipping = () => {
    if (cartTotal >= 50) {
      return 0;
    }
    return 5.99;
  };

  const shipping = calculateShipping();
  const tax = cartTotal * 0.08; // 8% tax
  const finalTotal = cartTotal + shipping + tax;

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
          <p className="text-gray-600 mb-6">Your order ID is: <span className="font-semibold">{orderId}</span></p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty.</h2>
        <p className="text-gray-600">Please add items to your cart before proceeding to checkout.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Information Form */}
        <div className="lg:w-2/3 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  required 
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address *</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City *</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-gray-700 text-sm font-bold mb-2">Zip Code *</label>
                <input 
                  type="text" 
                  id="zip" 
                  name="zip" 
                  value={formData.zip} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  required 
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6 mt-8">Payment Method</h2>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <input 
                  type="radio" 
                  id="credit" 
                  name="paymentMethod" 
                  value="credit" 
                  checked={formData.paymentMethod === 'credit'} 
                  onChange={handleChange} 
                  className="mr-2" 
                />
                <label htmlFor="credit" className="text-gray-700">Credit Card</label>
              </div>
              
              {formData.paymentMethod === 'credit' && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-bold mb-2">Card Number</label>
                      <input 
                        type="text" 
                        id="cardNumber" 
                        name="cardNumber" 
                        value={formData.cardNumber} 
                        onChange={handleChange} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div>
                      <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
                      <input 
                        type="text" 
                        id="expiryDate" 
                        name="expiryDate" 
                        value={formData.expiryDate} 
                        onChange={handleChange} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-gray-700 text-sm font-bold mb-2">CVV</label>
                      <input 
                        type="text" 
                        id="cvv" 
                        name="cvv" 
                        value={formData.cvv} 
                        onChange={handleChange} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  id="paypal" 
                  name="paymentMethod" 
                  value="paypal" 
                  checked={formData.paymentMethod === 'paypal'} 
                  onChange={handleChange} 
                  className="mr-2" 
                />
                <label htmlFor="paypal" className="text-gray-700">PayPal</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="cod" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={formData.paymentMethod === 'cod'} 
                  onChange={handleChange} 
                  className="mr-2" 
                />
                <label htmlFor="cod" className="text-gray-700">Cash on Delivery</label>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <span className="font-medium">{item.name}</span>
                  {item.selectedSize && <span className="text-sm text-gray-600 ml-2">(Size: {item.selectedSize})</span>}
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Free returns within 30 days
            </p>
            <p className="flex items-center mt-1">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Secure payment processing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;