
const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/').get(getCategories).post(protect, admin, createCategory);
router
  .route('/:id')
  .get(getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
