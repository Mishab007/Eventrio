import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Lookbook = () => {
  const navigate = useNavigate();
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  // Load saved outfits from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    setSavedOutfits(saved);
  }, []);

  // Sample lookbook data (in a real app, this would come from a database)
  const lookbookData = [
    {
      id: 1,
      title: "Summer Casual",
      category: "casual",
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500",
      description: "Perfect for a sunny day out",
      products: [
        { name: "White T-Shirt", price: 29.99 },
        { name: "Denim Shorts", price: 49.99 },
        { name: "Sneakers", price: 89.99 }
      ]
    },
    {
      id: 2,
      title: "Office Ready",
      category: "formal",
      image: "https://images.unsplash.com/photo-1591369822091-7c106f75bc4a?w=500",
      description: "Professional and stylish",
      products: [
        { name: "Blazer", price: 129.99 },
        { name: "Dress Pants", price: 69.99 },
        { name: "Oxford Shoes", price: 99.99 }
      ]
    },
    {
      id: 3,
      title: "Evening Glam",
      category: "party",
      image: "https://images.unsplash.com/photo-1535296233005-1a15c271d7e3?w=500",
      description: "Turn heads at your next event",
      products: [
        { name: "Cocktail Dress", price: 149.99 },
        { name: "Heels", price: 79.99 },
        { name: "Clutch", price: 39.99 }
      ]
    },
    {
      id: 4,
      title: "Weekend Adventure",
      category: "casual",
      image: "https://images.unsplash.com/photo-1529361138415-30d4f49ab2fb?w=500",
      description: "Comfort meets style",
      products: [
        { name: "Hoodie", price: 59.99 },
        { name: "Jeans", price: 79.99 },
        { name: "Boots", price: 109.99 }
      ]
    },
    {
      id: 5,
      title: "Date Night",
      category: "party",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500",
      description: "Romantic and elegant",
      products: [
        { name: "Blouse", price: 49.99 },
        { name: "Skirt", price: 59.99 },
        { name: "Flats", price: 69.99 }
      ]
    },
    {
      id: 6,
      title: "Business Casual",
      category: "formal",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
      description: "Professional yet relaxed",
      products: [
        { name: "Button-Up Shirt", price: 39.99 },
        { name: "Chinos", price: 59.99 },
        { name: "Loafers", price: 89.99 }
      ]
    }
  ];

  // Filter looks by category
  const filteredLooks = activeCategory === 'all' 
    ? lookbookData 
    : lookbookData.filter(look => look.category === activeCategory);

  // Get unique categories
  const categories = ['all', ...new Set(lookbookData.map(look => look.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Fashion Lookbook</h1>
      <p className="text-gray-600 text-center mb-12">
        Get inspired by our curated collection of stylish outfits
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full capitalize ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Lookbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLooks.map(look => (
          <div key={look.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img 
                src={look.image} 
                alt={look.title} 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{look.title}</h3>
                <p className="text-sm opacity-90">{look.description}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Featured Items:</h4>
                <ul className="space-y-1">
                  {look.products.map((product, index) => (
                    <li key={index} className="text-sm text-gray-600 flex justify-between">
                      <span>{product.name}</span>
                      <span>${product.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => navigate('/outfit-builder')}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Recreate This Look
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User Saved Outfits */}
      {savedOutfits.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Saved Outfits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOutfits.slice(0, 3).map(outfit => (
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
                        // In a real implementation, you would navigate to the outfit builder with these items
                        navigate('/outfit-builder');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Use This Look
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {savedOutfits.length > 3 && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/outfit-builder')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                View All Your Outfits
              </button>
            </div>
          )}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Create Your Own Style</h2>
        <p className="mb-6">
          Use our outfit builder to create and save your favorite looks
        </p>
        <button 
          onClick={() => navigate('/outfit-builder')}
          className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition"
        >
          Build Your Outfit
        </button>
      </div>
    </div>
  );
};

export default Lookbook;