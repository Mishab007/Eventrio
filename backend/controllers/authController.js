
const User = require('../models/userModel.js');
const generateToken = require('../utils/generateToken.js');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).send('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send('Invalid user data');
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.role === 'seller' && !user.isApproved) {
      return res.status(401).send('Seller not approved yet');
    }
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    });
  } else {
    return res.status(401).send('Invalid email or password');
  }
};

// @desc    Create first admin user (only if no admin exists)
// @route   POST /api/auth/create-admin
// @access  Public (only for initial setup)
const createAdmin = async (req, res) => {
  try {
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isApproved: true, // Admin is auto-approved
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user._id),
        message: 'Admin user created successfully'
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, createAdmin };
