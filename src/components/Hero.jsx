import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      sections: [
        {
          image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80',
          title: 'Oxford',
          subtitle: 'Shoes'
        },
        {
          image: 'https://images.unsplash.com/photo-1589756823695-278bc8356b59?w=800&q=80',
          title: 'Silk',
          subtitle: 'Ties'
        },
        {
          image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80',
          title: 'Derby',
          subtitle: 'Shoes'
        },
        {
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
          title: 'Designer',
          subtitle: 'Blazers'
        }
      ],
      mainTitle: 'Refined Elegance',
      mainSubtitle: 'Premium Shoes & Accessories'
    },
    {
      id: 2,
      sections: [
        {
          image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
          title: 'Loafers',
          subtitle: 'Collection'
        },
        {
          image: 'https://images.unsplash.com/photo-1602190509557-d9900f2d0e82?w=800&q=80',
          title: 'Classic',
          subtitle: 'Neckties'
        },
        {
          image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80',
          title: 'Brogues',
          subtitle: 'Leather'
        },
        {
          image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80',
          title: 'Premium',
          subtitle: 'Watches'
        }
      ],
      mainTitle: 'Timeless Classics',
      mainSubtitle: 'Sophisticated Footwear & Ties'
    },
    {
      id: 3,
      sections: [
        {
          image: 'https://images.unsplash.com/photo-1612821287511-eb25d0e1de39?w=800&q=80',
          title: 'Smart',
          subtitle: 'Sneakers'
        },
        {
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
          title: 'Bow',
          subtitle: 'Ties'
        },
        {
          image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
          title: 'Dress',
          subtitle: 'Shoes'
        },
        {
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
          title: 'Leather',
          subtitle: 'Goods'
        }
      ],
      mainTitle: 'Complete Your Look',
      mainSubtitle: 'Essential Finishing Touches'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gray-900">
      {/* Split Grid Layout - No gaps */}
      <div className="relative h-full grid grid-cols-2 grid-rows-2 gap-0">
        <AnimatePresence mode="wait">
          {/* Top Left - Slides Left to Right */}
          <motion.div
            key={`tl-${currentSlide}`}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/category/formal')}
          >
            <img 
              src={currentSlideData.sections[0].image}
              alt={currentSlideData.sections[0].title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 md:bottom-14 md:left-14">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
              >
                {currentSlideData.sections[0].title}
              </motion.h3>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl md:text-3xl text-white/90"
              >
                {currentSlideData.sections[0].subtitle}
              </motion.p>
            </div>
          </motion.div>

          {/* Top Right - Slides Right to Left */}
          <motion.div
            key={`tr-${currentSlide}`}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/category/watches')}
          >
            <img 
              src={currentSlideData.sections[1].image}
              alt={currentSlideData.sections[1].title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 md:bottom-14 md:right-14 text-right">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
              >
                {currentSlideData.sections[1].title}
              </motion.h3>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl md:text-3xl text-white/90"
              >
                {currentSlideData.sections[1].subtitle}
              </motion.p>
            </div>
          </motion.div>

          {/* Bottom Left - Slides Right to Left */}
          <motion.div
            key={`bl-${currentSlide}`}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
            className="relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/category/bags')}
          >
            <img 
              src={currentSlideData.sections[2].image}
              alt={currentSlideData.sections[2].title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 md:top-14 md:left-14">
              <motion.h3 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
              >
                {currentSlideData.sections[2].title}
              </motion.h3>
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl sm:text-2xl md:text-3xl text-white/90"
              >
                {currentSlideData.sections[2].subtitle}
              </motion.p>
            </div>
          </motion.div>

          {/* Bottom Right - Slides Left to Right */}
          <motion.div
            key={`br-${currentSlide}`}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
            className="relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/category/jackets')}
          >
            <img 
              src={currentSlideData.sections[3].image}
              alt={currentSlideData.sections[3].title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute top-6 right-6 sm:top-10 sm:right-10 md:top-14 md:right-14 text-right">
              <motion.h3 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
              >
                {currentSlideData.sections[3].title}
              </motion.h3>
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl sm:text-2xl md:text-3xl text-white/90"
              >
                {currentSlideData.sections[3].subtitle}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Center Overlay with Main Title - Minimal Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center px-6 sm:px-8 md:px-12 py-4 sm:py-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 drop-shadow-2xl">
              {currentSlideData.mainTitle}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white drop-shadow-2xl mb-6">
              {currentSlideData.mainSubtitle}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/lookbook');
              }}
              className="bg-white text-gray-900 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition pointer-events-auto shadow-2xl"
            >
              Explore Collection
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

{/* Side Indicators */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-1 h-12 bg-white rounded-full'
                : 'w-1 h-8 bg-white/50 rounded-full hover:bg-white/75 hover:h-10'
            }`} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;