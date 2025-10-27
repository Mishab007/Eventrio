import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useProducts } from '@/context/ProductContext.jsx';
import ProductCard from '@/components/ProductCard.jsx';

const FlashSale = ({ title = "Flash Sale", duration = 24 }) => {
  const { products, getSaleProducts } = useProducts();
  const [saleProducts, setSaleProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Set initial time left (24 hours by default)
  useEffect(() => {
    const hours = Math.floor(duration);
    const minutes = Math.floor((duration - hours) * 60);
    setTimeLeft({ hours, minutes, seconds: 0 });
  }, [duration]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get sale products
  useEffect(() => {
    const saleItems = getSaleProducts(4);
    setSaleProducts(saleItems);
  }, [products, getSaleProducts]);

  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  if (saleProducts.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-red-600 to-orange-500 py-12 my-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-xl text-white">Limited time offer - Don{`'`}t miss out!</p>
          </div>
          <div className="bg-black bg-opacity-20 rounded-lg p-4 mt-4 md:mt-0">
            <div className="text-white text-center">
              <p className="text-sm mb-1">Ends in</p>
              <div className="flex space-x-2">
                <div className="bg-white bg-opacity-20 rounded px-3 py-2">
                  <span className="text-2xl font-bold">{formatTime(timeLeft.hours)}</span>
                  <p className="text-xs">HRS</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded px-3 py-2">
                  <span className="text-2xl font-bold">{formatTime(timeLeft.minutes)}</span>
                  <p className="text-xs">MINS</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded px-3 py-2">
                  <span className="text-2xl font-bold">{formatTime(timeLeft.seconds)}</span>
                  <p className="text-xs">SECS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {saleProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

FlashSale.propTypes = {
  title: PropTypes.string,
  duration: PropTypes.number, // Duration in hours
};

export default FlashSale;