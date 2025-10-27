/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react' // Import useState and useEffect
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { motion } from 'framer-motion'; // Import framer-motion
import Rightbar from '@/components/Rightbar.jsx' // Use alias
import Hero from '@/components/Hero.jsx'; // Use alias
import ProductGrid from '@/components/ProductGrid.jsx'; // Use alias
import ProductCarousel from '@/components/ProductCarousel.jsx'; // Use alias
import ProductQuickView from '@/components/ProductQuickView.jsx'; // Import ProductQuickView
import Recommendations from '@/components/Recommendations.jsx'; // Import Recommendations
import RecentlyViewed from '@/components/RecentlyViewed.jsx'; // Import RecentlyViewed
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations.jsx'; // Import PersonalizedRecommendations
import TrendingNow from '@/components/TrendingNow.jsx'; // Import TrendingNow
import FlashSale from '@/components/FlashSale.jsx'; // Import FlashSale
import { useProducts } from '@/context/ProductContext.jsx'; // Import useProducts

function Home() {
  const navigate = useNavigate(); // For navigation to category pages
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [selectedCategory, setSelectedCategory] = useState('all'); // State for category filter
  const [sortOrder, setSortOrder] = useState('newest'); // State for sort order
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false); // State for quick view modal
  const [selectedProduct, setSelectedProduct] = useState(null); // State for product in quick view
  const { products, getRecommendations, getTrendingProducts, getSaleProducts, getNewArrivals, getBestSellers } = useProducts(); // Get products and functions from context
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  // Load special product collections
  useEffect(() => {
    setTrendingProducts(getTrendingProducts(8));
    setSaleProducts(getSaleProducts(8));
    setNewArrivalProducts(getNewArrivals(8));
    setBestSellerProducts(getBestSellers(8));
  }, [products, getTrendingProducts, getSaleProducts, getNewArrivals, getBestSellers]);

  const categories = ['all', 'shirts', 'jeans', 'jackets', 'shoes'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  const handleQuickViewOpen = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setSelectedProduct(null);
    setIsQuickViewOpen(false);
  };

  // Category grid data
  const categoryData = [
    { id: 1, name: 'Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', count: '24 items' },
    { id: 2, name: 'Jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', count: '18 items' },
    { id: 3, name: 'Jackets', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', count: '15 items' },
    { id: 4, name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', count: '22 items' },
    { id: 5, name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', count: '28 items' },
    { id: 6, name: 'Accessories', image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500', count: '35 items' },
    { id: 7, name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500', count: '32 items' },
    { id: 8, name: 'Sweaters', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', count: '19 items' },
    { id: 9, name: 'Pants', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', count: '26 items' },
    { id: 10, name: 'Skirts', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', count: '21 items' },
    { id: 11, name: 'Bags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500', count: '17 items' },
    { id: 12, name: 'Watches', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500', count: '14 items' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
    {/* Header is rendered globally in router; removing duplicate from Home */}
    <Hero /> {/* Render Hero component */}

    {/* Quick Access Cards - New Arrivals, Sale, Brands, Deals */}
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 sm:px-6 py-6 md:py-8 dark:bg-gray-900"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* New Arrivals Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          onClick={() => navigate('/new-arrivals')}
          className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-xl transition-all duration-300"
        >
          <div className="aspect-square sm:aspect-[4/3] p-4 sm:p-6 flex flex-col justify-between text-white">
            <div>
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">New Arrivals</h3>
              <p className="text-xs sm:text-sm opacity-90">Fresh styles just in</p>
            </div>
            <div className="flex items-center text-xs sm:text-sm font-medium opacity-90 group-hover:translate-x-1 transition-transform">
              Explore Now
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Sale Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          onClick={() => navigate('/sale')}
          className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group bg-gradient-to-br from-red-500 to-red-600 hover:shadow-xl transition-all duration-300"
        >
          <div className="aspect-square sm:aspect-[4/3] p-4 sm:p-6 flex flex-col justify-between text-white">
            <div>
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">Sale</h3>
              <p className="text-xs sm:text-sm opacity-90">Up to 70% off</p>
            </div>
            <div className="flex items-center text-xs sm:text-sm font-medium opacity-90 group-hover:translate-x-1 transition-transform">
              Shop Sale
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Brands Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          onClick={() => navigate('/brands')}
          className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group bg-gradient-to-br from-purple-500 to-purple-600 hover:shadow-xl transition-all duration-300"
        >
          <div className="aspect-square sm:aspect-[4/3] p-4 sm:p-6 flex flex-col justify-between text-white">
            <div>
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">Brands</h3>
              <p className="text-xs sm:text-sm opacity-90">Top fashion brands</p>
            </div>
            <div className="flex items-center text-xs sm:text-sm font-medium opacity-90 group-hover:translate-x-1 transition-transform">
              View Brands
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Deals Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          onClick={() => navigate('/deals')}
          className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group bg-gradient-to-br from-green-500 to-green-600 hover:shadow-xl transition-all duration-300"
        >
          <div className="aspect-square sm:aspect-[4/3] p-4 sm:p-6 flex flex-col justify-between text-white">
            <div>
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">Deals</h3>
              <p className="text-xs sm:text-sm opacity-90">Special offers today</p>
            </div>
            <div className="flex items-center text-xs sm:text-sm font-medium opacity-90 group-hover:translate-x-1 transition-transform">
              See Deals
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>

    {/* Create Your Look Banner */}
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900 py-8 md:py-12 my-6 md:my-8 relative overflow-hidden"
    >
      {/* Animated background shapes */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 opacity-10 rounded-full"
        animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg"
        >
          Create Your Perfect Look
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg md:text-xl text-white mb-4 md:mb-6 px-4 drop-shadow"
        >
          Mix and match your favorite items to create the perfect outfit
        </motion.p>
        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/outfit-builder')}
          className="bg-white text-indigo-700 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg hover:bg-gray-100 transition duration-300 shadow-xl"
        >
          Build Your Outfit
        </motion.button>
      </div>
    </motion.section>

    {/* Category Grid Section */}
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 sm:px-6 py-8 md:py-12 dark:bg-gray-900"
    >
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center mb-6 md:mb-8"
      >
        Shop by Category
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {categoryData.map((category, index) => (
          <motion.div 
            key={category.id} 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group"
            onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-2 sm:p-3 md:p-4 text-white">
              <h3 className="text-base sm:text-lg md:text-xl font-bold">{category.name}</h3>
              <p className="text-xs sm:text-sm opacity-90">{category.count}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Flash Sale */}
    <FlashSale title="Flash Sale" duration={24} />

    {/* Trending Now */}
    <TrendingNow title="Trending Now" limit={4} />

    {/* Fashion Lookbook Section */}
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 sm:px-6 py-8 md:py-12"
    >
      <div className="text-center mb-6 md:mb-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3"
        >
          Fashion Lookbook
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400"
        >
          Get inspired by our curated style collections
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Lookbook Card 1 - Casual Chic */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/lookbook?style=casual-chic')}
          className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-80 sm:h-96"
        >
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" 
            alt="Casual Chic" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-4 sm:p-6">
              <span className="inline-block bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">TRENDING</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Casual Chic</h3>
              <p className="text-sm sm:text-base text-white/90 mb-3">Effortless everyday style</p>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition transform group-hover:translate-x-2">
                View Collection →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lookbook Card 2 - Business Professional */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/lookbook?style=business-professional')}
          className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-80 sm:h-96"
        >
          <img 
            src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80" 
            alt="Business Professional" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-4 sm:p-6">
              <span className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">PROFESSIONAL</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Business Pro</h3>
              <p className="text-sm sm:text-base text-white/90 mb-3">Power dressing for success</p>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition transform group-hover:translate-x-2">
                View Collection →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lookbook Card 3 - Evening Glam */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/lookbook?style=evening-glam')}
          className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-80 sm:h-96 md:col-span-2 lg:col-span-1"
        >
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" 
            alt="Evening Glam" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-4 sm:p-6">
              <span className="inline-block bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">SPECIAL</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Evening Glam</h3>
              <p className="text-sm sm:text-base text-white/90 mb-3">Shine bright at every event</p>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition transform group-hover:translate-x-2">
                View Collection →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lookbook Card 4 - Street Style */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/lookbook?style=street-style')}
          className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-80 sm:h-96"
        >
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" 
            alt="Street Style" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-4 sm:p-6">
              <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">EDGY</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Street Style</h3>
              <p className="text-sm sm:text-base text-white/90 mb-3">Bold urban fashion</p>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition transform group-hover:translate-x-2">
                View Collection →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lookbook Card 5 - Athleisure */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/lookbook?style=athleisure')}
          className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-80 sm:h-96"
        >
          <img 
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80" 
            alt="Athleisure" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-4 sm:p-6">
              <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">ACTIVE</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Athleisure</h3>
              <p className="text-sm sm:text-base text-white/90 mb-3">Comfort meets style</p>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition transform group-hover:translate-x-2">
                View Collection →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lookbook Card 6 - Summer Vibes */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/lookbook?style=summer-vibes')}
          className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-80 sm:h-96"
        >
          <img 
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80" 
            alt="Summer Vibes" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-4 sm:p-6">
              <span className="inline-block bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">SEASONAL</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Summer Vibes</h3>
              <p className="text-sm sm:text-base text-white/90 mb-3">Light & breezy looks</p>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition transform group-hover:translate-x-2">
                View Collection →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* View Full Lookbook Button */}
      <div className="text-center mt-8 md:mt-12">
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/lookbook')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-bold py-3 px-8 rounded-full text-base sm:text-lg hover:shadow-xl transition-all duration-300"
        >
          Explore Full Lookbook
        </motion.button>
      </div>
    </motion.section>

    {/* Best Sellers */}
    {bestSellerProducts.length > 0 && (
      <section className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Best Sellers</h2>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => navigate('/best-sellers')}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {bestSellerProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                  BEST SELLER
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button 
                    className="bg-gray-900 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition"
                    onClick={() => handleQuickViewOpen(product)}
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* New Arrivals Grid */}
    {newArrivalProducts.length > 0 && (
      <section className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">New Arrivals</h2>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => navigate('/new-arrivals')}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {newArrivalProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button 
                    className="bg-gray-900 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition"
                    onClick={() => handleQuickViewOpen(product)}
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Personalized Recommendations */}
    <PersonalizedRecommendations />

    {/* Recently Viewed Products */}
    <RecentlyViewed title="Recently Viewed" />

    {/* Featured Products Carousel */}
    <ProductCarousel onQuickView={handleQuickViewOpen} />

    {/* Brand Logos Section */}
    <section className="bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6 md:mb-8">Popular Brands</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <div key={id} className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Newsletter Signup */}
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-10 md:py-16 my-8 md:my-12">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 md:mb-4">Join Our Newsletter</h2>
        <p className="text-base sm:text-lg md:text-xl text-white mb-6 md:mb-8 px-4">Subscribe to get special offers, free giveaways, and new product alerts</p>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-0 px-4">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow px-4 py-2 sm:py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none"
          />
          <button className="bg-gray-900 text-white px-6 py-2 sm:py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg font-medium hover:bg-gray-800 transition">
            Subscribe
          </button>
        </div>
      </div>
    </section>

    {/* Quick View Modal */}
    {isQuickViewOpen && selectedProduct && (
      <ProductQuickView product={selectedProduct} onClose={handleQuickViewClose} />
    )}
    </div>
  )
}

export default Home