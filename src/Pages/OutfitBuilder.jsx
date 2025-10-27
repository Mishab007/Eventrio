import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext.jsx';
import { useCart } from '@/context/CartContext.jsx';
import { useWishlist } from '@/context/WishlistContext.jsx';
import { useNavigate } from 'react-router-dom';

const OutfitBuilder = () => {
  const { products, getRecommendations } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  // Filter products by category for outfit building
  const tops = products.filter(p => p.status === 'approved' && 
    (p.category === 'shirts' || p.category === 'jackets'));
  const bottoms = products.filter(p => p.status === 'approved' && 
    p.category === 'jeans');
  const shoes = products.filter(p => p.status === 'approved' && 
    p.category === 'shoes');

  // State for selected items in the outfit
  const [selectedOutfit, setSelectedOutfit] = useState({
    top: null,
    bottom: null,
    shoes: null
  });

  // State for outfit name and description
  const [outfitDetails, setOutfitDetails] = useState({
    name: '',
    description: ''
  });

  // State for saved outfits
  const [savedOutfits, setSavedOutfits] = useState([]);

  // State for recommended products
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Load saved outfits from localStorage on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    setSavedOutfits(saved);
  }, []);

  // Load recommended products
  useEffect(() => {
    const recommendations = getRecommendations(null, 6);
    setRecommendedProducts(recommendations);
  }, [getRecommendations]);

  // Save outfits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));
  }, [savedOutfits]);

  const handleSelectItem = (category, product) => {
    setSelectedOutfit(prev => ({
      ...prev,
      [category]: product
    }));
  };

  const handleSaveOutfit = () => {
    if (!outfitDetails.name.trim()) {
      alert('Please enter a name for your outfit');
      return;
    }

    if (!selectedOutfit.top || !selectedOutfit.bottom || !selectedOutfit.shoes) {
      alert('Please select one item from each category');
      return;
    }

    const newOutfit = {
      id: Date.now(),
      name: outfitDetails.name,
      description: outfitDetails.description,
      items: { ...selectedOutfit },
      createdAt: new Date().toISOString()
    };

    setSavedOutfits(prev => [...prev, newOutfit]);
    setOutfitDetails({ name: '', description: '' });
    alert('Outfit saved successfully!');
  };

  const handleAddToCart = () => {
    if (!selectedOutfit.top || !selectedOutfit.bottom || !selectedOutfit.shoes) {
      alert('Please select one item from each category');
      return;
    }

    // Add all items to cart
    addToCart(selectedOutfit.top);
    addToCart(selectedOutfit.bottom);
    addToCart(selectedOutfit.shoes);
    
    alert('Outfit added to cart!');
    navigate('/checkout');
  };

  const handleAddToWishlist = () => {
    if (!selectedOutfit.top || !selectedOutfit.bottom || !selectedOutfit.shoes) {
      alert('Please select one item from each category');
      return;
    }

    // Add all items to wishlist
    addToWishlist(selectedOutfit.top);
    addToWishlist(selectedOutfit.bottom);
    addToWishlist(selectedOutfit.shoes);
    
    alert('Outfit added to wishlist!');
  };

  const handleClearOutfit = () => {
    setSelectedOutfit({
      top: null,
      bottom: null,
      shoes: null
    });
  };

  const handleShareOutfit = (outfit) => {
    // In a real implementation, this would share the outfit via social media or copy a link
    const outfitText = `Check out my outfit: ${outfit.name}

Items:
- ${outfit.items.top.name}
- ${outfit.items.bottom.name}
- ${outfit.items.shoes.name}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Fashion Outfit',
        text: outfitText,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(outfitText).then(() => {
        alert('Outfit details copied to clipboard!');
      });
    }
  };

  // Calculate total price of the outfit
  const outfitTotal = Object.values(selectedOutfit)
    .filter(item => item)
    .reduce((total, item) => {
      const price = item.discount > 0 
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + price;
    }, 0);

  // Calculate total discount of the outfit
  const outfitDiscount = Object.values(selectedOutfit)
    .filter(item => item && item.discount > 0)
    .reduce((total, item) => {
      const discountAmount = item.price * (item.discount / 100);
      return total + discountAmount;
    }, 0);

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 text-center">Create Your Look</h1>
      <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8 px-2">
        Mix and match your favorite items to create the perfect outfit
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Outfit Builder Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Build Your Outfit</h2>
            
            {/* Outfit Preview */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">Your Current Look</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 text-center">
                  {selectedOutfit.top ? (
                    <div>
                      <img 
                        src={selectedOutfit.top.image} 
                        alt={selectedOutfit.top.name} 
                        className="w-full h-24 sm:h-28 md:h-32 object-cover rounded mb-1 sm:mb-2"
                      />
                      <p className="text-xs sm:text-sm font-medium truncate">{selectedOutfit.top.name}</p>
                      <p className="text-xs text-gray-600">
                        ${selectedOutfit.top.discount > 0 
                          ? (selectedOutfit.top.price * (1 - selectedOutfit.top.discount / 100)).toFixed(2)
                          : selectedOutfit.top.price.toFixed(2)}
                        {selectedOutfit.top.discount > 0 && (
                          <span className="ml-1 text-red-500 text-xs">
                            ({selectedOutfit.top.discount}% off)
                          </span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center">
                      <span className="text-gray-500">Top</span>
                    </div>
                  )}
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {selectedOutfit.bottom ? (
                    <div>
                      <img 
                        src={selectedOutfit.bottom.image} 
                        alt={selectedOutfit.bottom.name} 
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="text-sm font-medium">{selectedOutfit.bottom.name}</p>
                      <p className="text-xs text-gray-600">
                        ${selectedOutfit.bottom.discount > 0 
                          ? (selectedOutfit.bottom.price * (1 - selectedOutfit.bottom.discount / 100)).toFixed(2)
                          : selectedOutfit.bottom.price.toFixed(2)}
                        {selectedOutfit.bottom.discount > 0 && (
                          <span className="ml-1 text-red-500 text-xs">
                            ({selectedOutfit.bottom.discount}% off)
                          </span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center">
                      <span className="text-gray-500">Bottom</span>
                    </div>
                  )}
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {selectedOutfit.shoes ? (
                    <div>
                      <img 
                        src={selectedOutfit.shoes.image} 
                        alt={selectedOutfit.shoes.name} 
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="text-sm font-medium">{selectedOutfit.shoes.name}</p>
                      <p className="text-xs text-gray-600">
                        ${selectedOutfit.shoes.discount > 0 
                          ? (selectedOutfit.shoes.price * (1 - selectedOutfit.shoes.discount / 100)).toFixed(2)
                          : selectedOutfit.shoes.price.toFixed(2)}
                        {selectedOutfit.shoes.discount > 0 && (
                          <span className="ml-1 text-red-500 text-xs">
                            ({selectedOutfit.shoes.discount}% off)
                          </span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center">
                      <span className="text-gray-500">Shoes</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Total: ${outfitTotal.toFixed(2)}
                  {outfitDiscount > 0 && (
                    <span className="text-sm text-red-500 ml-2">
                      (You save ${outfitDiscount.toFixed(2)})
                    </span>
                  )}
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={handleClearOutfit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={handleAddToWishlist}
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                  >
                    Add to Wishlist
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Save Outfit Form */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Save Your Outfit</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Outfit Name</label>
                  <input
                    type="text"
                    value={outfitDetails.name}
                    onChange={(e) => setOutfitDetails(prev => ({...prev, name: e.target.value}))}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g., Weekend Casual"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    value={outfitDetails.description}
                    onChange={(e) => setOutfitDetails(prev => ({...prev, description: e.target.value}))}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Describe your outfit..."
                    rows="3"
                  />
                </div>
                <button 
                  onClick={handleSaveOutfit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Outfit
                </button>
              </div>
            </div>
          </div>
          
          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended for You</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recommendedProducts.slice(0, 3).map(product => (
                  <div 
                    key={product.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      // Add to the appropriate category in the outfit builder
                      if (product.category === 'shirts' || product.category === 'jackets') {
                        handleSelectItem('top', product);
                      } else if (product.category === 'jeans') {
                        handleSelectItem('bottom', product);
                      } else if (product.category === 'shoes') {
                        handleSelectItem('shoes', product);
                      }
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-600">{product.category}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold">
                          ${product.discount > 0 
                            ? (product.price * (1 - product.discount / 100)).toFixed(2)
                            : product.price.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Product Selection Section */}
        <div>
          {/* Tops Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tops</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {tops.map(product => (
                <div 
                  key={product.id}
                  className={`flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    selectedOutfit.top?.id === product.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectItem('top', product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded mr-3"
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        ${product.discount > 0 
                          ? (product.price * (1 - product.discount / 100)).toFixed(2)
                          : product.price.toFixed(2)}
                      </p>
                      {product.discount > 0 && (
                        <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottoms Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Bottoms</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {bottoms.map(product => (
                <div 
                  key={product.id}
                  className={`flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    selectedOutfit.bottom?.id === product.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectItem('bottom', product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded mr-3"
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        ${product.discount > 0 
                          ? (product.price * (1 - product.discount / 100)).toFixed(2)
                          : product.price.toFixed(2)}
                      </p>
                      {product.discount > 0 && (
                        <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Shoes Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Shoes</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {shoes.map(product => (
                <div 
                  key={product.id}
                  className={`flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    selectedOutfit.shoes?.id === product.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectItem('shoes', product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded mr-3"
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        ${product.discount > 0 
                          ? (product.price * (1 - product.discount / 100)).toFixed(2)
                          : product.price.toFixed(2)}
                      </p>
                      {product.discount > 0 && (
                        <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Saved Outfits Section */}
      {savedOutfits.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Saved Outfits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOutfits.map(outfit => (
              <div key={outfit.id} className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-1 p-2 bg-gray-100">
                  {Object.values(outfit.items).map((item, index) => (
                    <img 
                      key={index}
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-20 object-cover"
                    />
                  ))}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{outfit.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{outfit.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <button 
                      onClick={() => {
                        setSelectedOutfit(outfit.items);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Use This Look
                    </button>
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleShareOutfit(outfit)}
                        className="text-sm text-green-600 hover:text-green-800"
                      >
                        Share
                      </button>
                      <button 
                        onClick={() => {
                          setSavedOutfits(prev => prev.filter(o => o.id !== outfit.id));
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitBuilder;