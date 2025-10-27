import PropTypes from 'prop-types';
import { motion } from 'framer-motion'; // Import motion
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useWishlist } from '@/context/WishlistContext.jsx'; // Import useWishlist
import { useCart } from '@/context/CartContext.jsx'; // Import useCart

const ProductCard = ({ product, onQuickView }) => { // Add onQuickView prop
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isProductInWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevent triggering quick view
    if (isProductInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering navigation
    addToCart(product);
    // Show visual feedback
    const button = e.currentTarget;
    button.textContent = 'Added!';
    setTimeout(() => {
      button.textContent = 'Add to Cart';
    }, 2000);
  };

  const imageSrc = product.image && product.image.length > 0
    ? product.image
    : (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="16">No Image</text></svg>')

  // Calculate discount percentage if available
  const discountPercentage = product.discount && product.discount > 0 
    ? Math.round(product.discount) 
    : 0;

  // Colorful gradient options
  const cardBorderColors = [
    'hover:border-blue-400',
    'hover:border-purple-400',
    'hover:border-pink-400',
    'hover:border-green-400',
    'hover:border-orange-400',
    'hover:border-indigo-400'
  ];
  const randomBorderColor = cardBorderColors[product.id.charCodeAt(0) % cardBorderColors.length];

  const discountGradients = [
    'bg-gradient-to-r from-red-500 to-pink-500',
    'bg-gradient-to-r from-orange-500 to-red-500',
    'bg-gradient-to-r from-purple-500 to-pink-500',
    'bg-gradient-to-r from-blue-500 to-cyan-500',
    'bg-gradient-to-r from-green-500 to-emerald-500'
  ];
  const randomDiscountGradient = discountGradients[product.id.charCodeAt(1) % discountGradients.length];

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative cursor-pointer group border-2 border-transparent ${randomBorderColor} dark:border-gray-700 transition-all duration-300`}
      whileHover={{ scale: 1.03, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Discount badge */}
      {discountPercentage > 0 && (
        <div className={`absolute top-2 left-2 ${randomDiscountGradient} text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg animate-pulse`}>
          {discountPercentage}% OFF
        </div>
      )}
      
      {/* Wishlist button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-gray-700 bg-opacity-75 hover:bg-opacity-100 transition duration-300 z-10"
        aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          className={`w-6 h-6 ${isProductInWishlist ? 'text-red-500' : 'text-gray-400 dark:text-gray-300 hover:text-red-500'}`}
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
      
      {/* Product image */}
      <div className="relative overflow-hidden aspect-[3/4] sm:aspect-square">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          loading="lazy" // Add lazy loading
        />
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black dark:bg-gray-900 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <button 
            className="bg-white dark:bg-gray-800 dark:text-white text-gray-900 px-4 py-2 rounded-md font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
          >
            Quick View
          </button>
        </div>
      </div>
      
      {/* Product info */}
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-1 truncate">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm capitalize mb-2">{product.category}</p>
          </div>
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{product.rating || 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            {discountPercentage > 0 ? (
              <>
                <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through ml-1 sm:ml-2">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button 
            className="bg-blue-600 dark:bg-blue-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
        
        {/* Colors available (if any) */}
        {product.color && (
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-500 mr-2">Color:</span>
            <span className="text-xs font-medium">{product.color}</span>
          </div>
        )}
        
        {/* Sizes available (if any) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-500 mr-2">Sizes:</span>
            <span className="text-xs font-medium">{product.sizes.join(', ')}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    category: PropTypes.string,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
    discount: PropTypes.number,
    color: PropTypes.string,
    sizes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onQuickView: PropTypes.func,
};

export default ProductCard;