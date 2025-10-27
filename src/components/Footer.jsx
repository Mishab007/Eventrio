const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-24 mt-8 sm:mt-12 transition-colors duration-300">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Column 1: About Us */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Mall of Men</h3>
          <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base">
            Your ultimate destination for the latest trends in men&apos;s clothing. Quality, style, and comfort delivered to your doorstep.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white text-sm sm:text-base">Shop</a></li>
            <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white text-sm sm:text-base">New Arrivals</a></li>
            <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white text-sm sm:text-base">Sale</a></li>
            <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white text-sm sm:text-base">About Us</a></li>
            <li><a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white text-sm sm:text-base">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Newsletter & Social */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Stay Connected</h3>
          <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base mb-4">Subscribe to our newsletter for exclusive offers and updates.</p>
          <div className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="p-2 sm:p-2.5 rounded-l-md sm:rounded-l-md rounded-r-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white dark:bg-gray-700 w-full mb-2 sm:mb-0 text-sm sm:text-base"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-2.5 rounded-md sm:rounded-l-none sm:rounded-r-md text-sm sm:text-base">
              Subscribe
            </button>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-6">
            <a href="#" className="text-gray-400 hover:text-white text-lg sm:text-xl"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-gray-400 hover:text-white text-lg sm:text-xl"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-gray-400 hover:text-white text-lg sm:text-xl"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-gray-400 hover:text-white text-lg sm:text-xl"><i className="fab fa-pinterest"></i></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-500 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} Mall of Men. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
