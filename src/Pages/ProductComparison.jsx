import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext.jsx';

const ProductComparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useProducts();
  
  const [comparisonProducts, setComparisonProducts] = useState([]);

  // Get product IDs from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const productIds = searchParams.get('ids')?.split(',') || [];
    
    // Find products by IDs
    const foundProducts = productIds
      .map(id => products.find(p => p.id === id && p.status === 'approved'))
      .filter(Boolean); // Remove undefined/null values
    
    setComparisonProducts(foundProducts);
  }, [products, location.search]);

  if (comparisonProducts.length < 2) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Comparison</h1>
        <p className="text-gray-600 mb-6">Please select at least 2 products to compare</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Get all unique features from products
  const getAllFeatures = () => {
    const features = new Set();
    comparisonProducts.forEach(product => {
      // Add basic features
      features.add('Price');
      features.add('Category');
      features.add('Rating');
      features.add('Discount');
      
      // Add color if available
      if (product.color) {
        features.add('Color');
      }
      
      // Add sizes if available
      if (product.sizes && product.sizes.length > 0) {
        features.add('Sizes');
      }
      
      // Add any tags as features
      if (product.tags && product.tags.length > 0) {
        product.tags.forEach(tag => features.add(tag));
      }
    });
    return Array.from(features).sort();
  };

  const features = getAllFeatures();

  // Get feature value for a product
  const getFeatureValue = (product, feature) => {
    switch (feature) {
      case 'Price':
        return `$${product.price.toFixed(2)}`;
      case 'Category':
        return product.category;
      case 'Rating':
        return product.rating ? `${product.rating}/5` : 'N/A';
      case 'Discount':
        return product.discount > 0 ? `${product.discount}%` : 'None';
      case 'Color':
        return product.color || 'N/A';
      case 'Sizes':
        return product.sizes ? product.sizes.join(', ') : 'N/A';
      default:
        // Check if feature exists in tags
        if (product.tags && product.tags.includes(feature)) {
          return '✓';
        }
        return 'N/A';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Product Comparison</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 bg-gray-50 p-4 text-left">Features</th>
              {comparisonProducts.map(product => (
                <th key={product.id} className="border border-gray-200 bg-gray-50 p-4 text-center">
                  <div className="flex flex-col items-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-24 h-24 object-cover mb-2"
                    />
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <button 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                    >
                      View Details
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(feature => (
              <tr key={feature} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-4 font-medium">{feature}</td>
                {comparisonProducts.map(product => (
                  <td key={`${product.id}-${feature}`} className="border border-gray-200 p-4 text-center">
                    {getFeatureValue(product, feature)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Previous Page
        </button>
      </div>
    </div>
  );
};

export default ProductComparison;