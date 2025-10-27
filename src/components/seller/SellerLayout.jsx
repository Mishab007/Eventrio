import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

function SellerLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
        <Link to="/seller" className="text-xl font-bold">Seller</Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile sidebar */}
      {isMenuOpen && (
        <aside className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white border-r border-gray-200 z-10 overflow-y-auto">
          <nav className="p-4 space-y-1">
            <NavLink 
              to="/seller" 
              end 
              className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Products
            </NavLink>
            <NavLink 
              to="/seller/new" 
              className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Add Product
            </NavLink>
          </nav>
        </aside>
      )}

      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <Link to="/seller" className="text-xl font-bold">Seller</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/seller" end className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>My Products</NavLink>
          <NavLink to="/seller/new" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Add Product</NavLink>
        </nav>
      </aside>
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:ml-0">
          <div className="md:hidden">
            <h1 className="text-lg font-semibold">Seller Dashboard</h1>
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">Seller Dashboard</h1>
          </div>
          <Link to="/" className="text-sm text-blue-600 hover:underline">Back to store</Link>
        </header>
        <main className="p-4 mt-16 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  )
}

SellerLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default SellerLayout