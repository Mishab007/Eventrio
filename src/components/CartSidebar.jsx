import { useState } from 'react'; // Import useState
import { useCart } from '@/context/CartContext.jsx';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleCheckout = () => {
    toggleCart(); // Close cart sidebar
    navigate('/checkout'); // Navigate to checkout page
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10' && !couponApplied) {
      setDiscount(10); // Apply $10 discount
      setCouponApplied(true);
      alert('Coupon "SAVE10" applied! You get $10 off.');
    } else if (couponApplied) {
      alert('A coupon has already been applied.');
    } else {
      alert('Invalid or expired coupon code.');
    }
  };

  // Calculate shipping cost (free shipping over $50)
  const calculateShipping = () => {
    if (cartTotal >= 50) {
      return 0;
    }
    return 5.99;
  };

  const shipping = calculateShipping();
  const finalTotal = cartTotal - discount + shipping;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Your Cart ({cartItems.length})</h2>
        <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-200px)]"> {/* Adjusted height */}
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p className="text-gray-500 mt-4">Your cart is empty.</p>
            <button 
              onClick={() => {
                toggleCart();
                navigate('/');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center mb-4 border-b pb-4 last:mb-0 last:pb-0">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  {item.selectedSize && <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>}
                  <p className="text-sm text-gray-600">(${item.price.toFixed(2)})</p>
                  <div className="flex items-center mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white">
          {/* Coupon Code Input */}
          <div className="mb-4">
            <label htmlFor="coupon" className="block text-gray-700 text-sm font-bold mb-2">Coupon Code:</label>
            <div className="flex">
              <input
                type="text"
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="SAVE10"
                disabled={couponApplied}
              />
              <button
                onClick={applyCoupon}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={couponApplied}
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-green-600 text-sm mt-1">Coupon applied successfully!</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => {
              toggleCart();
              navigate('/outfit-builder');
            }}
            className="w-full mt-2 bg-purple-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-purple-700 transition duration-300"
          >
            Create an Outfit
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;