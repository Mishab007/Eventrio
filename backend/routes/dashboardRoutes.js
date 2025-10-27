
const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
} = require('../controllers/dashboardController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/').get(protect, admin, getDashboardAnalytics);

module.exports = router;
