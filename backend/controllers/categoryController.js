
const Category = require('../models/categoryModel.js');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404).send('Category not found');
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  const category = new Category({
    name,
    description,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name;
    category.description = description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404).send('Category not found');
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.remove();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404).send('Category not found');
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
