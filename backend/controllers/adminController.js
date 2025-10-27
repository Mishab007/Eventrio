
const User = require('../models/userModel.js');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isApproved = req.body.isApproved || user.isApproved;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isApproved: updatedUser.isApproved,
    });
  } else {
    res.status(404).send('User not found');
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).send('User not found');
  }
};

// @desc    Get sellers to approve
// @route   GET /api/admin/sellers/approve
// @access  Private/Admin
const getSellersToApprove = async (req, res) => {
  const sellers = await User.find({ role: 'seller', isApproved: false });
  res.json(sellers);
};

// @desc    Approve seller
// @route   PUT /api/admin/sellers/approve/:id
// @access  Private/Admin
const approveSeller = async (req, res) => {
  const seller = await User.findById(req.params.id);

  if (seller && seller.role === 'seller') {
    seller.isApproved = true;
    const approvedSeller = await seller.save();
    res.json(approvedSeller);
  } else {
    res.status(404).send('Seller not found');
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSellersToApprove,
  approveSeller,
};
