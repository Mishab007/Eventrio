
const express = require('express');
const router = express.Router();
const {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} = require('../controllers/discountController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/').get(getDiscounts).post(protect, admin, createDiscount);
router
  .route('/:id')
  .get(getDiscountById)
  .put(protect, admin, updateDiscount)
  .delete(protect, admin, deleteDiscount);

module.exports = router;
