import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import ProductQuickView from '@/components/ProductQuickView.jsx';

const Sale = () => {
  const { products, getSaleProducts } = useProducts();
  const [saleProducts, setSaleProducts] = useState([]);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState('discount');
  const [filterOptions, setFilterOptions] = useState({
    category: 'all',
    minDiscount: '',
    maxPrice: '',
  });

  // Load sale products
  useEffect(() => {
    const sales = getSaleProducts(50); // Get up to 50 sale products
    setSaleProducts(sales);
  }, [products, getSaleProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = () => {
    let result = [...saleProducts];

    // Apply category filter
    if (filterOptions.category !== 'all') {
      result = result.filter(p => p.category === filterOptions.category);
    }

    // Apply discount filter
    if (filterOptions.minDiscount) {
      result = result.filter(p => p.discount >= parseFloat(filterOptions.minDiscount));
    }

    // Apply price filter
    if (filterOptions.maxPrice) {
      result = result.filter(p => p.price <= parseFloat(filterOptions.maxPrice));
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === 'price-asc') {
        return a.price - b.price;
      } else if (sortOrder === 'price-desc') {
        return b.price - a.price;
      } else if (sortOrder === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortOrder === 'discount') {
        // Sort by discount percentage (highest first)
        return b.discount - a.discount;
      } else {
        // 'newest' sorting (by ID, newest first)
        return b.id.localeCompare(a.id);
      }
    });

    return result;
  };

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
      category: 'all',
      minDiscount: '',
      maxPrice: '',
    });
    setSortOrder('discount');
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(saleProducts.map(p => p.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sale & Discounts</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
              <select
                name="category"
                value={filterOptions.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Discount Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Minimum Discount</h3>
              <select
                name="minDiscount"
                value={filterOptions.minDiscount}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any Discount</option>
                <option value="50">50% or more</option>
                <option value="40">40% or more</option>
                <option value="30">30% or more</option>
                <option value="20">20% or more</option>
                <option value="10">10% or more</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Max Price</h3>
              <div className="flex items-center">
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  value={filterOptions.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          {/* Sort Options */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-4 bg-white rounded-lg shadow-md">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">{filteredAndSortedProducts().length} products on sale</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="discount">Highest Discount</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Display */}
          {filteredAndSortedProducts().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts().map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={handleQuickViewOpen} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more products.
              </p>
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

export default Sale;