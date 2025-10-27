import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ProductCard from '@/components/ProductCard.jsx';
import { useProducts } from '@/context/ProductContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCarousel = ({ onQuickView }) => {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.status === 'approved').slice(0, 8);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  // Number of products to show based on screen size
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && featuredProducts.length > itemsPerView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = featuredProducts.length - itemsPerView;
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 3000); // Change slide every 3 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, featuredProducts.length, itemsPerView]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const maxIndex = featuredProducts.length - itemsPerView;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const maxIndex = featuredProducts.length - itemsPerView;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const maxIndex = Math.max(0, featuredProducts.length - itemsPerView);
  const visibleProducts = featuredProducts.slice(currentIndex, currentIndex + itemsPerView);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-0">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white"
        >
          Featured Products
        </motion.h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2 sm:px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm sm:text-base">View All</button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        {featuredProducts.length > itemsPerView && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Previous"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Next"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Products Grid with Animation */}
        <div className="overflow-hidden px-1 sm:px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`grid gap-3 sm:gap-4 md:gap-6 ${
                itemsPerView === 1 ? 'grid-cols-1' :
                itemsPerView === 2 ? 'grid-cols-2' :
                itemsPerView === 3 ? 'grid-cols-3' :
                'grid-cols-4'
              }`}
            >
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} onQuickView={onQuickView} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        {featuredProducts.length > itemsPerView && (
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'bg-blue-600 w-6 sm:w-8 h-2 sm:h-2.5'
                    : 'bg-gray-300 w-2 sm:w-2.5 h-2 sm:h-2.5 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && featuredProducts.length > itemsPerView && (
        <motion.div 
          className="mt-4 sm:mt-6 h-1 bg-gray-200 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
          />
        </motion.div>
      )}
    </section>
  );
};

ProductCarousel.propTypes = {
  onQuickView: PropTypes.func,
};

export default ProductCarousel;