import PropTypes from 'prop-types';
import ProductCard from '@/components/ProductCard.jsx';
import { useProducts } from '@/context/ProductContext.jsx'

const ProductGrid = ({ searchTerm, selectedCategory, sortOrder, onQuickView }) => { // Accept new props
  const { products } = useProducts()
  let productsToDisplay = products.filter(p => p.status === 'approved');

  // Apply search filter
  if (searchTerm) {
    productsToDisplay = productsToDisplay.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply category filter
  if (selectedCategory !== 'all') {
    productsToDisplay = productsToDisplay.filter(product =>
      product.category === selectedCategory
    );
  }

  // Apply sorting
  productsToDisplay.sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.price - b.price;
    } else if (sortOrder === 'price-desc') {
      return b.price - a.price;
    }
    // 'newest' or default sorting (no change to original order)
    return 0;
  });

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {selectedCategory === 'all' ? 'All Products' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </h2>
        <div className="text-gray-600">
          {productsToDisplay.length} products found
        </div>
      </div>
      
      {productsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productsToDisplay.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => {
              // Reset filters
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};

ProductGrid.propTypes = {
  searchTerm: PropTypes.string,
  selectedCategory: PropTypes.string,
  sortOrder: PropTypes.string,
  onQuickView: PropTypes.func,
};

export default ProductGrid;