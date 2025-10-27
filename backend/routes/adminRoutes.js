
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSellersToApprove,
  approveSeller,
} = require('../controllers/adminController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/users').get(protect, admin, getUsers);
router
  .route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.route('/sellers/approve').get(protect, admin, getSellersToApprove);
router.route('/sellers/approve/:id').put(protect, admin, approveSeller);

module.exports = router;
