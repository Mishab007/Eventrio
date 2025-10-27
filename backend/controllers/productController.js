const Product = require('../models/productModel.js');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res) => {
  const { name, description, price, category, stock, images } = req.body;

  // Validate category
  const validCategories = ['shirts', 'jeans', 'jackets', 'shoes'];
  if (!validCategories.includes(category)) {
    return res.status(400).send('Invalid category');
  }

  // Ensure images is always an array
  const productImages = Array.isArray(images) ? images : (images ? [images] : []);

  const product = new Product({
    name,
    description,
    price,
    category,
    seller: req.user._id,
    stock: stock || 0,
    images: productImages,
    // Set status based on user role - admins can create approved products, others get pending
    status: req.user.role === 'admin' ? 'approved' : 'pending',
  });

  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send('Failed to create product');
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, images } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if the user is authorized to update this product
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).send('Not authorized to update this product');
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['shirts', 'jeans', 'jackets', 'shoes'];
      if (!validCategories.includes(category)) {
        return res.status(400).send('Invalid category');
      }
    }

    // Ensure images is always an array
    const productImages = Array.isArray(images) ? images : (images ? [images] : []);

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.images = productImages.length > 0 ? productImages : product.images;

    try {
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).send('Failed to update product');
    }
  } else {
    res.status(404).send('Product not found');
  }
};

// @desc    Approve/Reject a product
// @route   POST /api/products/:id/approve
// @access  Private/Admin
const approveProduct = async (req, res) => {
  const { approved } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  product.status = approved ? 'approved' : 'rejected';
  try {
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error('Error approving product:', error);
    res.status(500).send('Failed to approve product');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    try {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Failed to delete product');
    }
  } else {
    res.status(404).send('Product not found');
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
};