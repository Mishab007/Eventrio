import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard.jsx';
import { useProducts } from '@/context/ProductContext.jsx';
import ProductQuickView from '@/components/ProductQuickView.jsx';

const CategoryPage = () => {
  const { category } = useParams();
  const { products } = useProducts();
  const [sortOrder, setSortOrder] = useState('newest');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    rating: '',
  });
  const [viewMode, setViewMode] = useState('grid'); // grid or list view
  const [compareProducts, setCompareProducts] = useState([]); // For product comparison

  // Get products for this category
  const categoryProducts = useMemo(() => {
    return products.filter(
      p => p.status === 'approved' && p.category.toLowerCase() === category.toLowerCase()
    );
  }, [products, category]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];
    
    // Apply price filters
    if (filterOptions.minPrice) {
      result = result.filter(p => p.price >= parseFloat(filterOptions.minPrice));
    }
    if (filterOptions.maxPrice) {
      result = result.filter(p => p.price <= parseFloat(filterOptions.maxPrice));
    }
    
    // Apply size filter
    if (filterOptions.size) {
      result = result.filter(p => 
        p.sizes && p.sizes.includes(filterOptions.size)
      );
    }
    
    // Apply color filter
    if (filterOptions.color) {
      result = result.filter(p => 
        p.color && p.color.toLowerCase().includes(filterOptions.color.toLowerCase())
      );
    }
    
    // Apply rating filter
    if (filterOptions.rating) {
      result = result.filter(p => 
        p.rating && p.rating >= parseFloat(filterOptions.rating)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === 'price-asc') {
        return a.price - b.price;
      } else if (sortOrder === 'price-desc') {
        return b.price - a.price;
      } else if (sortOrder === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === 'discount') {
        const aDiscount = a.discount || 0;
        const bDiscount = b.discount || 0;
        return bDiscount - aDiscount;
      }
      // 'newest' or default sorting
      return 0;
    });
    
    return result;
  }, [categoryProducts, filterOptions, sortOrder]);

  // Get unique sizes and colors for filters
  const allSizes = useMemo(() => {
    return [...new Set(categoryProducts.flatMap(p => p.sizes || []))];
  }, [categoryProducts]);

  const allColors = useMemo(() => {
    return [...new Set(categoryProducts.map(p => p.color).filter(Boolean))];
  }, [categoryProducts]);

  const handleQuickViewOpen = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setSelectedProduct(null);
    setIsQuickViewOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilterOptions({
      minPrice: '',
      maxPrice: '',
      size: '',
      color: '',
      rating: '',
    });
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Toggle product for comparison
  const toggleCompareProduct = (product) => {
    setCompareProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else if (prev.length < 3) {
        return [...prev, product];
      } else {
        alert('You can compare up to 3 products');
        return prev;
      }
    });
  };

  // View comparison
  const viewComparison = () => {
    if (compareProducts.length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }
    // In a real implementation, this would navigate to a comparison page
    alert(`Comparing ${compareProducts.length} products`);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">{formatCategoryName(category)}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Discover our collection of {formatCategoryName(category)}. 
          Showing {filteredProducts.length} products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-20 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Filters</h2>
              <button 
                onClick={clearFilters}
                className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Clear All
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-4 sm:mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 text-sm sm:text-base">Price Range</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filterOptions.minPrice}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filterOptions.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Size Filter */}
            {allSizes.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Size</h3>
                <select
                  name="size"
                  value={filterOptions.size}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                >
                  <option value="">All Sizes</option>
                  {allSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Filter */}
            {allColors.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Color</h3>
                <select
                  name="color"
                  value={filterOptions.color}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                >
                  <option value="">All Colors</option>
                  {allColors.map(color => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rating Filter */}
            <div className="mb-4 sm:mb-6">
              <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Minimum Rating</h3>
              <select
                name="rating"
                value={filterOptions.rating}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full lg:w-3/4">
          {/* Sort Options and View Mode */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-lg shadow-md gap-3 sm:gap-0">
            <div className="mb-0">
              <p className="text-sm sm:text-base text-gray-600">{filteredProducts.length} products found</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center flex-1 sm:flex-initial">
                <label htmlFor="sort" className="mr-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap">Sort by:</label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border border-gray-300 rounded-md p-1.5 sm:p-2 text-xs sm:text-sm flex-1 sm:flex-initial"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Discount</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
              
              {/* Compare Button */}
              {compareProducts.length > 0 && (
                <button
                  onClick={viewComparison}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs sm:text-sm"
                >
                  Compare ({compareProducts.length})
                </button>
              )}
            </div>
          </div>

          {/* Products Display */}
          {filteredProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard 
                      product={product} 
                      onQuickView={handleQuickViewOpen} 
                    />
                    {/* Compare Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <label className="flex items-center bg-white bg-opacity-75 rounded px-1.5 sm:px-2 py-0.5 sm:py-1">
                        <input
                          type="checkbox"
                          checked={compareProducts.some(p => p.id === product.id)}
                          onChange={() => toggleCompareProduct(product)}
                          className="mr-0.5 sm:mr-1"
                        />
                        <span className="text-xs">Compare</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full sm:w-1/3 relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-48 sm:h-full object-cover"
                      />
                      {/* Compare Checkbox */}
                      <div className="absolute top-2 left-2 z-10">
                        <label className="flex items-center bg-white bg-opacity-75 rounded px-1.5 sm:px-2 py-0.5 sm:py-1">
                          <input
                            type="checkbox"
                            checked={compareProducts.some(p => p.id === product.id)}
                            onChange={() => toggleCompareProduct(product)}
                            className="mr-0.5 sm:mr-1"
                          />
                          <span className="text-xs">Compare</span>
                        </label>
                      </div>
                    </div>
                    <div className="w-full sm:w-2/3 p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm capitalize mb-2">{product.category}</p>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 text-sm sm:text-base">
                          {'★'.repeat(Math.floor(product.rating || 0))}
                          {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({product.rating || 'N/A'})</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 gap-2 sm:gap-0">
                        <div className="flex items-center flex-wrap">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-lg sm:text-xl font-bold text-gray-900">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                              <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded">
                                {product.discount}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-lg sm:text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex space-x-2 w-full sm:w-auto">
                          <button 
                            className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 transition flex-1 sm:flex-initial"
                            onClick={() => handleQuickViewOpen(product)}
                          >
                            Quick View
                          </button>
                          <button 
                            className="bg-gray-200 text-gray-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-gray-300 transition flex-1 sm:flex-initial"
                            onClick={() => {
                              // Add to cart functionality
                            }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters</p>
              <button 
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && selectedProduct && (
        <ProductQuickView product={selectedProduct} onClose={handleQuickViewClose} />
      )}
    </div>
  );
};

export default CategoryPage;