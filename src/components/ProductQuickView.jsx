import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext.jsx';
import { useWishlist } from '@/context/WishlistContext.jsx';

// Helper component for Star Rating display
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
      </svg>
    );
  }
  return <div className="flex">{stars}</div>;
};

const ProductQuickView = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isProductInWishlist = isInWishlist(product.id);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    addToCart({ ...product, selectedSize }, quantity);
    alert(`${quantity} of ${product.name} (Size: ${selectedSize}) added to cart!`);
  };

  const handleWishlistClick = () => {
    if (isProductInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (!product) {
    return null; // Or a loading state
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col lg:flex-row gap-8 p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>

        {/* Product Image Gallery */}
        <div className="lg:w-1/2 relative"> {/* Added relative for wishlist button positioning */}
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md mb-4"
            loading="lazy"
          />
          <div className="flex space-x-2 overflow-x-auto">
            {product.images && product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                  mainImage === img ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setMainImage(img)}
                loading="lazy"
              />
            ))}
          </div>
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition duration-300 z-10"
            aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={`w-6 h-6 ${isProductInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              fill={isProductInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </button>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6 leading-relaxed">{product.description_long}</p>

          {/* Size Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Size:</h3>
            <div className="flex space-x-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quantity:</h3>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Add to Cart
          </button>

          {/* Customer Reviews */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
            <div className="flex items-center mb-4">
              <StarRating rating={product.rating} />
              <span className="ml-2 text-gray-600">({product.reviews.length} reviews)</span>
            </div>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-gray-800">{review.author}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-gray-700">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
