import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

function AdminLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
        <Link to="/admin" className="text-xl font-bold">Admin</Link>
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
              to="/admin" 
              end 
              className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/admin/products" 
              className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </NavLink>
            <NavLink 
              to="/admin/approvals" 
              className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Approvals
            </NavLink>
            <NavLink 
              to="/admin/orders" 
              className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Orders
            </NavLink>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Users
            </NavLink>
          </nav>
        </aside>
      )}

      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <Link to="/admin" className="text-xl font-bold">Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin" end className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Products</NavLink>
          <NavLink to="/admin/approvals" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Approvals</NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Orders</NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>Users</NavLink>
        </nav>
      </aside>
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:ml-0">
          <div className="md:hidden">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
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

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default AdminLayout