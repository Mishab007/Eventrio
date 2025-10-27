import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useProducts } from '@/context/ProductContext.jsx';
import ProductCard from '@/components/ProductCard.jsx';

const TrendingNow = ({ title = "Trending Now", limit = 8 }) => {
  const { products, getTrendingProducts } = useProducts();
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    const trending = getTrendingProducts(limit);
    setTrendingProducts(trending);
  }, [products, getTrendingProducts, limit]);

  if (trendingProducts.length === 0) return null;

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

TrendingNow.propTypes = {
  title: PropTypes.string,
  limit: PropTypes.number,
};

export default TrendingNow;