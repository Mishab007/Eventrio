import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext.jsx';
import { useWishlist } from '@/context/WishlistContext.jsx';
import { useCart } from '@/context/CartContext.jsx';

function Profile() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { getRecentlyViewed } = useProducts();
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load user data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        postalCode: user.postalCode || ''
      });
    }

    // Load recently viewed products
    const viewed = getRecentlyViewed(8);
    setRecentlyViewed(viewed);

    // Load saved outfits from localStorage
    const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    setSavedOutfits(outfits);

    // Load order history from localStorage (mock data for now)
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    setOrderHistory(orders);
  }, [isLoggedIn, navigate, user, getRecentlyViewed]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the user profile
    alert('Profile updated successfully!');
    setIsEditingProfile(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'recently-viewed', label: 'Recently Viewed', icon: '👁️' },
    { id: 'outfits', label: 'Saved Outfits', icon: '👔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-900 dark:to-purple-900 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 text-center sm:text-left text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{user.name || 'User'}</h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90 mb-2 sm:mb-3">{user.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">Member since {new Date().getFullYear()}</span>
              <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">{user.role === 'admin' ? '👑 Admin' : user.role === 'seller' ? '🏪 Seller' : '🛍️ Customer'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 md:p-6 text-center transition-colors duration-300">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">{orderHistory.length}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 md:p-6 text-center transition-colors duration-300">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">{wishlistItems.length}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Wishlist Items</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 md:p-6 text-center transition-colors duration-300">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">{cartItems.length}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cart Items</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 md:p-6 text-center transition-colors duration-300">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1 sm:mb-2">{savedOutfits.length}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Saved Outfits</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 sm:mb-8 transition-colors duration-300">
        <div className="border-b dark:border-gray-700 overflow-x-auto">
          <div className="flex min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Account Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base"><span className="font-medium">Name:</span> {user.name || 'Not set'}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">Email:</span> {user.email}</p>
                    <p className="text-sm sm:text-base"><span className="font-medium">Phone:</span> {user.phone || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Shipping Address</h3>
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base">{user.address || 'No address added'}</p>
                    {user.city && <p className="text-sm sm:text-base">{user.city}, {user.postalCode}</p>}
                    {user.country && <p className="text-sm sm:text-base">{user.country}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">Quick Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600">Total Spent</p>
                    <p className="text-base sm:text-lg font-bold text-blue-600">$0.00</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Items Purchased</p>
                    <p className="text-base sm:text-lg font-bold text-blue-600">0</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reviews Written</p>
                    <p className="text-base sm:text-lg font-bold text-blue-600">0</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Loyalty Points</p>
                    <p className="text-base sm:text-lg font-bold text-blue-600">0</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Order History</h2>
              {orderHistory.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 sm:mb-3">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">Order #{order.id}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-green-100 text-green-800">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm sm:text-base"><span className="font-medium">Total:</span> ${order.total}</p>
                        <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">No orders yet</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">My Wishlist</h2>
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img src={item.image} alt={item.name} className="w-full h-40 sm:h-48 object-cover" />
                      <div className="p-2 sm:p-3">
                        <h3 className="font-semibold text-sm sm:text-base mb-1">{item.name}</h3>
                        <p className="text-base sm:text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">❤️</div>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Your wishlist is empty</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Browse Products
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Recently Viewed Tab */}
          {activeTab === 'recently-viewed' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Recently Viewed</h2>
              {recentlyViewed.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {recentlyViewed.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}>
                      <img src={item.image} alt={item.name} className="w-full h-40 sm:h-48 object-cover" />
                      <div className="p-2 sm:p-3">
                        <h3 className="font-semibold text-sm sm:text-base mb-1">{item.name}</h3>
                        <p className="text-base sm:text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">👁️</div>
                  <p className="text-gray-600 text-sm sm:text-base">No recently viewed products</p>
                </div>
              )}
            </div>
          )}

          {/* Saved Outfits Tab */}
          {activeTab === 'outfits' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Saved Outfits</h2>
              {savedOutfits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {savedOutfits.map((outfit) => (
                    <div key={outfit.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">{outfit.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">{outfit.description}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {outfit.items.top && (
                          <img src={outfit.items.top.image} alt="Top" className="w-full h-20 sm:h-24 object-cover rounded" />
                        )}
                        {outfit.items.bottom && (
                          <img src={outfit.items.bottom.image} alt="Bottom" className="w-full h-20 sm:h-24 object-cover rounded" />
                        )}
                        {outfit.items.shoes && (
                          <img src={outfit.items.shoes.image} alt="Shoes" className="w-full h-20 sm:h-24 object-cover rounded" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">👔</div>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">No saved outfits yet</p>
                  <button 
                    onClick={() => navigate('/outfit-builder')}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Create Outfit
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Account Settings</h2>
              
              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={profileData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={profileData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button type="submit" className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                      Save Changes
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base sm:text-lg font-semibold">Profile Information</h3>
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                      <p><span className="font-medium">Name:</span> {profileData.name || 'Not set'}</p>
                      <p><span className="font-medium">Email:</span> {profileData.email}</p>
                      <p><span className="font-medium">Phone:</span> {profileData.phone || 'Not set'}</p>
                      <p><span className="font-medium">Country:</span> {profileData.country || 'Not set'}</p>
                      <p className="md:col-span-2"><span className="font-medium">Address:</span> {profileData.address || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">Email Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">SMS Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">Newsletter</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2 sm:mb-3">Danger Zone</h3>
                    <p className="text-xs sm:text-sm text-red-600 mb-3 sm:mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 text-sm sm:text-base">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
