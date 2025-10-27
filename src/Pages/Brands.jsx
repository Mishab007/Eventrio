import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext.jsx';
import { useNavigate } from 'react-router-dom';

const Brands = () => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Extract unique brands from products
  useEffect(() => {
    const uniqueBrands = [...new Set(products
      .filter(p => p.status === 'approved' && p.brand)
      .map(p => p.brand)
    )];
    
    // For demo purposes, we'll create brand objects with placeholder data
    const brandData = uniqueBrands.map(brand => ({
      id: brand.toLowerCase().replace(/\s+/g, '-'),
      name: brand,
      logo: `https://placehold.co/100x100?text=${brand.charAt(0)}`,
      productCount: products.filter(p => p.status === 'approved' && p.brand === brand).length,
      featured: Math.random() > 0.7 // Randomly feature some brands
    }));
    
    setBrands(brandData);
  }, [products]);

  // Get products for a specific brand
  const getBrandProducts = (brandName) => {
    return products.filter(p => p.status === 'approved' && p.brand === brandName);
  };

  // Get featured brands
  const featuredBrands = brands.filter(brand => brand.featured);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Brand</h1>
      
      {/* Featured Brands */}
      {featuredBrands.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {featuredBrands.map(brand => (
              <div 
                key={brand.id}
                className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedBrand(brand)}
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">{brand.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-gray-800">{brand.name}</h3>
                <p className="text-sm text-gray-600">{brand.productCount} products</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Brands */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Brands</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map(brand => (
            <div 
              key={brand.id}
              className="bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
              onClick={() => setSelectedBrand(brand)}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">{brand.name.charAt(0)}</span>
              </div>
              <h3 className="font-medium text-gray-800 text-sm">{brand.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Detail Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-gray-600">{selectedBrand.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedBrand.name}</h2>
                    <p className="text-gray-600">{selectedBrand.productCount} products</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedBrand(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Brand Products */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getBrandProducts(selectedBrand.name).slice(0, 6).map(product => (
                    <div 
                      key={product.id} 
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedBrand(null);
                        navigate(`/product/${product.id}`);
                      }}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-gray-600 text-sm">{product.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${product.discount > 0 
                              ? (product.price * (1 - product.discount / 100)).toFixed(2)
                              : product.price.toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-sm text-red-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button 
                    onClick={() => {
                      setSelectedBrand(null);
                      // In a real implementation, you would navigate to a brand-specific page
                      // For now, we'll just close the modal
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View All {selectedBrand.name} Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;