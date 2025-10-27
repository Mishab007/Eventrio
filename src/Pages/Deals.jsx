import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import ProductQuickView from '@/components/ProductQuickView.jsx';
import FlashSale from '@/components/FlashSale.jsx';

const Deals = () => {
  const { products, getSaleProducts, getTrendingProducts } = useProducts();
  const [dealProducts, setDealProducts] = useState([]);
  const [trendingDeals, setTrendingDeals] = useState([]);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Load deal products
  useEffect(() => {
    // Get sale products
    const sales = getSaleProducts(20);
    setDealProducts(sales);
    
    // Get trending products with discounts
    const trending = getTrendingProducts(20).filter(p => p.discount > 0);
    setTrendingDeals(trending);
  }, [products, getSaleProducts, getTrendingProducts]);

  const handleQuickViewOpen = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setSelectedProduct(null);
    setIsQuickViewOpen(false);
  };

  // Filter products based on active tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'trending':
        return trendingDeals;
      case 'big-discount':
        return [...dealProducts].sort((a, b) => b.discount - a.discount);
      case 'under-50':
        return dealProducts.filter(p => (p.price * (1 - p.discount / 100)) < 50);
      case 'under-100':
        return dealProducts.filter(p => (p.price * (1 - p.discount / 100)) < 100);
      default:
        return dealProducts;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Special Deals</h1>
      
      {/* Flash Sale Section */}
      <section className="mb-12">
        <FlashSale title="Flash Sale" duration={6} />
      </section>
      
      {/* Deal Categories */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Deals
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'trending' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            Trending Deals
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'big-discount' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('big-discount')}
          >
            Biggest Discounts
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'under-50' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('under-50')}
          >
            Under $50
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'under-100' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('under-100')}
          >
            Under $100
          </button>
        </div>
      </div>

      {/* Products Display */}
      {getFilteredProducts().length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getFilteredProducts().map((product) => (
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No deals found</h3>
          <p className="text-gray-600 mb-4">
            Check back later for more special offers.
          </p>
          <button 
            onClick={() => setActiveTab('all')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            View All Deals
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {isQuickViewOpen && selectedProduct && (
        <ProductQuickView product={selectedProduct} onClose={handleQuickViewClose} />
      )}
    </div>
  );
};

export default Deals;