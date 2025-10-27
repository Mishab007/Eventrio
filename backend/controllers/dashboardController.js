
const Order = require('../models/orderModel.js');
const User = require('../models/userModel.js');
const Product = require('../models/productModel.js');

// @desc    Get dashboard analytics
// @route   GET /api/dashboard
// @access  Private/Admin
const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalOrders = await Order.countDocuments({});
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
        },
      },
    ]);

    const topProducts = await Product.find({}).sort({ 'rating': -1 }).limit(5);

    res.json({
      totalUsers,
      totalSellers,
      totalOrders,
      totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
      topProducts,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getDashboardAnalytics,
};
