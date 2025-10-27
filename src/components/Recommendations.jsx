import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useProducts } from '@/context/ProductContext.jsx';
import ProductCard from '@/components/ProductCard.jsx';

const Recommendations = ({ title = "Recommended For You" }) => {
  const { products, getRecommendations } = useProducts();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // In a real implementation, we would use actual user data
    // For now, we'll generate random recommendations
    const recs = getRecommendations(null, 4);
    setRecommendations(recs);
  }, [products, getRecommendations]);

  if (recommendations.length === 0) return null;

  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

Recommendations.propTypes = {
  title: PropTypes.string,
};

export default Recommendations;