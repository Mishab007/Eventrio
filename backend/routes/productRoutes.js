
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
} = require('../controllers/productController.js');
const { protect, admin, adminOrSeller } = require('../middleware/authMiddleware.js');

router.route('/').get(getProducts).post(protect, adminOrSeller, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, adminOrSeller, updateProduct)
  .delete(protect, admin, deleteProduct);

// Approve/Reject product
router.post('/:id/approve', protect, admin, approveProduct);

module.exports = router;
