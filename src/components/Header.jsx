import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useCart } from '@/context/CartContext.jsx'; // Import useCart
import { useAuth } from '@/context/AuthContext.jsx'; // Import useAuth
import { useWishlist } from '@/context/WishlistContext.jsx'; // Import useWishlist
import { useTheme } from '@/context/ThemeContext.jsx'; // Import useTheme
import { useProducts } from '@/context/ProductContext.jsx'; // Import useProducts
import PropTypes from 'prop-types'; // Import PropTypes

// Accept searchTerm and onSearchChange as props
const Header = ({ searchTerm, onSearchChange }) => {
  const navigate = useNavigate(); // For programmatic navigation
  const { toggleCart, cartItems } = useCart(); // Destructure toggleCart and cartItems
  const { isLoggedIn, logout, isAdmin, isSeller } = useAuth(); // Destructure auth context
  const { wishlistItems } = useWishlist(); // Destructure wishlistItems
  const { isDarkMode, toggleTheme } = useTheme(); // Destructure theme context
  const { searchProducts } = useProducts(); // Destructure searchProducts
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1); // For keyboard navigation
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false); // For account dropdown

  // Enhanced search with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearchChange(value);
    
    // Show predictive search results
    if (value.trim()) {
      const results = searchProducts(value);
      setSearchResults(results.slice(0, 8)); // Limit to 8 results
      setShowSearchResults(true);
      setFocusedIndex(-1);
      
      // Get category suggestions
      const allProducts = searchProducts('');
      const categories = [...new Set(allProducts.map(p => p.category))];
      const matchedCategories = categories.filter(cat => 
        cat.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setCategorySuggestions(matchedCategories);
    } else {
      setSearchResults([]);
      setCategorySuggestions([]);
      setShowSearchResults(false);
      setFocusedIndex(-1);
    }
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to search results page
    if (localSearchTerm.trim()) {
      setShowSearchResults(false);
      setFocusedIndex(-1);
      navigate(`/search?q=${encodeURIComponent(localSearchTerm)}`);
    }
  };
  
  // Keyboard navigation for search results
  const handleKeyDown = (e) => {
    if (!showSearchResults || (searchResults.length === 0 && categorySuggestions.length === 0)) return;
    
    const totalItems = searchResults.length + categorySuggestions.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => prev < totalItems - 1 ? prev + 1 : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : totalItems - 1);
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      if (focusedIndex < searchResults.length) {
        // Product selected
        const product = searchResults[focusedIndex];
        navigate(`/product/${product.id}`);
      } else {
        // Category selected
        const categoryIndex = focusedIndex - searchResults.length;
        const category = categorySuggestions[categoryIndex];
        navigate(`/category/${category}`);
      }
      setShowSearchResults(false);
      setLocalSearchTerm('');
      setFocusedIndex(-1);
    } else if (e.key === 'Escape') {
      setShowSearchResults(false);
      setFocusedIndex(-1);
    }
  };
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowSearchResults(false);
        setFocusedIndex(-1);
      }
      if (!e.target.closest('.account-dropdown')) {
        setShowAccountDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md py-3 sm:py-4 px-4 sm:px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center dark:bg-gray-900 dark:text-white relative sticky top-0 z-40"> {/* Added sticky positioning */}
      <div className="flex justify-between items-center w-full md:w-auto">
        <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Mall of Men
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button onClick={toggleTheme} className="text-gray-600 hover:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:text-white">
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.325 3.325l-.707.707M5.379 5.379l-.707-.707m12.728 0l-.707.707M6.025 18.325l-.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg> // Sun icon
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z"></path></svg> // Moon icon
            )}
          </button>
          <button onClick={toggleCart} className="relative text-gray-600 hover:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
          <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
      
      {/* Search bar - full width on mobile, normal on desktop */}
      <form onSubmit={handleSearchSubmit} className="w-full md:w-1/3 lg:w-2/5 my-3 md:my-0 relative search-container">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => localSearchTerm.trim() && setShowSearchResults(true)}
            className="w-full pl-10 pr-10 py-2 text-sm sm:text-base rounded-full bg-white/10 dark:bg-gray-700/30 backdrop-blur-md border border-white/20 dark:border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/40"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          {localSearchTerm && (
            <button 
              type="button"
              onClick={() => {
                setLocalSearchTerm('');
                onSearchChange('');
                setSearchResults([]);
                setCategorySuggestions([]);
                setShowSearchResults(false);
                setFocusedIndex(-1);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
        
        {/* Predictive search results */}
        {showSearchResults && (searchResults.length > 0 || categorySuggestions.length > 0) && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden">
            {searchResults.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Products</div>
                {searchResults.map((product, index) => (
                  <div 
                    key={product.id}
                    className={`flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                      index === focusedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setShowSearchResults(false);
                      setLocalSearchTerm('');
                      setFocusedIndex(-1);
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">{product.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{product.category} • ${product.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {categorySuggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase border-t border-gray-200 dark:border-gray-700">Shop by Category</div>
                {categorySuggestions.map((category, index) => {
                  const displayIndex = searchResults.length + index;
                  return (
                    <div 
                      key={category}
                      className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                        displayIndex === focusedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                      onClick={() => {
                        navigate(`/category/${category}`);
                        setShowSearchResults(false);
                        setLocalSearchTerm('');
                        setFocusedIndex(-1);
                      }}
                      onMouseEnter={() => setFocusedIndex(displayIndex)}
                    >
                      <div className="font-medium text-gray-800 dark:text-white">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Category</div>
                    </div>
                  );
                })}
              </>
            )}
            
            {localSearchTerm.trim() && (
              <div 
                className="p-3 text-center text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-t border-gray-200 dark:border-gray-700"
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(localSearchTerm)}`);
                  setShowSearchResults(false);
                  setFocusedIndex(-1);
                }}
              >
                {`View all results for "${localSearchTerm}"`}
              </div>
            )}
          </div>
        )}
      </form>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6"> {/* Added items-center for alignment */}
        <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white">Home</Link>
        <Link to="/lookbook" className="text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white">Lookbook</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/wishlist" className="relative text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white">
              Wishlist
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/order-history" className="text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white">Orders</Link>
            {isSeller && (
              <Link to="/seller" className="text-purple-600 hover:text-purple-900 font-medium dark:text-purple-400 dark:hover:text-purple-300">Seller</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-blue-600 hover:text-blue-900 font-medium dark:text-blue-400 dark:hover:text-blue-300">Admin</Link>
            )}
            <div className="relative account-dropdown">
              <button 
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white"
              >
                <span className="mr-1">Account</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 dark:bg-gray-800 z-50">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => setShowAccountDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => { logout(); setShowAccountDropdown(false); }} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white">Login</Link>
            <Link to="/signup" className="text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white">Sign Up</Link>
          </>
        )}
        
        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme} className="text-gray-600 hover:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:text-white">
          {isDarkMode ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.325 3.325l-.707.707M5.379 5.379l-.707-.707m12.728 0l-.707.707M6.025 18.325l-.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg> // Sun icon
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z"></path></svg> // Moon icon
          )}
        </button>
        
        {/* Cart Icon */}
        <button onClick={toggleCart} className="relative text-gray-600 hover:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 dark:bg-gray-800 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" onClick={closeMenu}>Home</Link>
            <Link to="/lookbook" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" onClick={closeMenu}>Lookbook</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/wishlist" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" onClick={closeMenu}>
                  Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center inline-block">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/order-history" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" onClick={closeMenu}>Order History</Link>
                {isSeller && (
                  <Link to="/seller" className="block px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:text-purple-900 hover:bg-gray-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-gray-700" onClick={closeMenu}>Seller Dashboard</Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-900 hover:bg-gray-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-gray-700" onClick={closeMenu}>Admin Panel</Link>
                )}
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" onClick={closeMenu}>Profile</Link>
                <button onClick={() => { logout(); closeMenu(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" onClick={closeMenu}>Login</Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" onClick={closeMenu}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

Header.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired
};

export default Header;