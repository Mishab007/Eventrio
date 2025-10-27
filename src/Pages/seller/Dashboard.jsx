import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { useProducts } from '@/context/ProductContext.jsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PartnerDashboard = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const [stats, setStats] = useState({
    totalProducts: 0,
    approvedProducts: 0,
    pendingProducts: 0,
    rejectedProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    averageRating: 0,
    viewsThisMonth: 0
  });

  // Get partner's products
  const partnerProducts = products.filter(p => 
    p.ownerEmail === user?.email || 
    p.partnerId === user?.id || 
    p.partnerId === user?._id
  );

  useEffect(() => {
    // Calculate statistics
    const approved = partnerProducts.filter(p => p.status === 'approved').length;
    const pending = partnerProducts.filter(p => p.status === 'pending').length;
    const rejected = partnerProducts.filter(p => p.status === 'rejected').length;
    
    // Mock data for revenue and orders (would come from backend)
    const revenue = partnerProducts.reduce((sum, p) => {
      return sum + (p.price * (p.soldCount || 0));
    }, 0);

    setStats({
      totalProducts: partnerProducts.length,
      approvedProducts: approved,
      pendingProducts: pending,
      rejectedProducts: rejected,
      totalRevenue: revenue,
      totalOrders: partnerProducts.reduce((sum, p) => sum + (p.soldCount || 0), 0),
      averageRating: 4.5, // Mock data
      viewsThisMonth: 1234 // Mock data
    });
  }, [partnerProducts]);

  const partnerProfile = user?.partnerProfile || {};
  const shopName = partnerProfile.shopName || user?.name || 'Your Shop';

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Approved Products',
      value: stats.approvedProducts,
      icon: '✅',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending Approval',
      value: stats.pendingProducts,
      icon: '⏳',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: '🛍️',
      color: 'bg-pink-500',
      textColor: 'text-pink-600'
    },
    {
      title: 'Average Rating',
      value: `${stats.averageRating} ⭐`,
      icon: '⭐',
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: 'Views This Month',
      value: stats.viewsThisMonth,
      icon: '👁️',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Shop Status',
      value: partnerProfile.status === 'approved' ? 'Active' : 'Pending',
      icon: partnerProfile.status === 'approved' ? '✓' : '⏳',
      color: partnerProfile.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500',
      textColor: partnerProfile.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'List a new item for sale',
      icon: '➕',
      link: '/partner/new-product',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      title: 'My Products',
      description: 'Manage your inventory',
      icon: '📋',
      link: '/partner/products',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      title: 'Orders',
      description: 'View and process orders',
      icon: '📦',
      link: '/partner/orders',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      title: 'Shop Settings',
      description: 'Update shop information',
      icon: '⚙️',
      link: '/partner/settings',
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    }
  ];

  const recentActivity = [
    { action: 'Product "Summer Dress" approved', time: '2 hours ago', type: 'success' },
    { action: 'New order #1234 received', time: '5 hours ago', type: 'info' },
    { action: 'Product "Winter Coat" pending review', time: '1 day ago', type: 'warning' },
    { action: 'Payment processed - $450.00', time: '2 days ago', type: 'success' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Shop Logo */}
            <div className="relative">
              {partnerProfile.shopLogo ? (
                <img 
                  src={partnerProfile.shopLogo} 
                  alt={shopName}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-purple-600">
                    {shopName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <span className="text-2xl">🏪</span>
              </div>
            </div>

            {/* Shop Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{shopName}</h1>
              <p className="text-white/90 mb-3 max-w-2xl">
                {partnerProfile.shopDescription || 'Welcome to your partner dashboard'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {partnerProfile.shopCategory && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    📁 {partnerProfile.shopCategory}
                  </span>
                )}
                {partnerProfile.yearsInBusiness && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    📅 {partnerProfile.yearsInBusiness} years in business
                  </span>
                )}
                {partnerProfile.status && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    partnerProfile.status === 'approved' 
                      ? 'bg-green-500' 
                      : 'bg-yellow-500'
                  }`}>
                    {partnerProfile.status === 'approved' ? '✓ Verified Partner' : '⏳ Pending Approval'}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <div className="text-sm text-white/80">Products</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <div className="text-sm text-white/80">Orders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your shop today.
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${stat.color} bg-opacity-10 flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={action.link}
                  className={`block ${action.color} rounded-lg shadow-md p-6 text-white hover:shadow-xl transition-shadow`}
                >
                  <div className="text-4xl mb-3">{action.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                  <p className="text-white/90 text-sm">{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{activity.action}</p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/partner/activity" className="block mt-4 text-center text-purple-600 hover:text-purple-700 font-medium">
              View All Activity →
            </Link>
          </motion.div>

          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-bold text-gray-800">$1,234</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Last Month</span>
                  <span className="font-bold text-gray-800">$980</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Target</span>
                  <span className="font-bold text-gray-800">$2,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">+26%</div>
                <div className="text-sm text-gray-600">Growth</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">89%</div>
                <div className="text-sm text-gray-600">Fulfillment Rate</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Products</h2>
            <Link to="/partner/products" className="text-purple-600 hover:text-purple-700 font-medium">
              View All →
            </Link>
          </div>
          {partnerProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {partnerProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gray-100">
                    <img 
                      src={product.image || product.images?.[0] || '/placeholder.jpg'} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                    <p className="text-purple-600 font-bold">${product.price}</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded mt-2 ${
                      product.status === 'approved' ? 'bg-green-100 text-green-700' :
                      product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first product</p>
              <Link
                to="/partner/new-product"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Add Your First Product
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
