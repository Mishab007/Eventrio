import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RecentlyViewed = ({ title = "Recently Viewed", limit = 8 }) => {
  const { getRecentlyViewed } = useProducts();
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get recently viewed products
    const recentlyViewed = getRecentlyViewed(limit);
    setRecentlyViewedProducts(recentlyViewed);
  }, [getRecentlyViewed, limit]);

  if (recentlyViewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
        <button 
          className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
          onClick={() => navigate('/recently-viewed')}
        >
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {recentlyViewedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

RecentlyViewed.propTypes = {
  title: PropTypes.string,
  limit: PropTypes.number
};

export default RecentlyViewed;