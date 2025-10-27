
const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  updateOrderToDelivered,
  createOrder,
  getMyOrders,
} = require('../controllers/orderController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router
  .route('/:id')
  .get(protect, admin, getOrderById)
  .put(protect, admin, updateOrderToDelivered);

module.exports = router;
