
const express = require('express');
const router = express.Router();
const {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
} = require('../controllers/contentController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/').get(getContents).post(protect, admin, createContent);
router
  .route('/:id')
  .get(getContentById)
  .put(protect, admin, updateContent)
  .delete(protect, admin, deleteContent);

module.exports = router;
