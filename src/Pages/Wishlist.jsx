import { useWishlist } from '@/context/WishlistContext.jsx';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 text-base sm:text-lg mb-4">Your wishlist is empty.</p>
          <Link to="/" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 text-sm sm:text-base">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {wishlistItems.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-300 z-10"
                aria-label="Remove from wishlist"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <Link to={`/product/${product.id}`} className="block">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover object-center"
                />
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm capitalize mb-2">{product.category}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;