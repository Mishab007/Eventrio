
const Discount = require('../models/discountModel.js');

// @desc    Fetch all discounts
// @route   GET /api/discounts
// @access  Public
const getDiscounts = async (req, res) => {
  const discounts = await Discount.find({});
  res.json(discounts);
};

// @desc    Fetch single discount
// @route   GET /api/discounts/:id
// @access  Public
const getDiscountById = async (req, res) => {
  const discount = await Discount.findById(req.params.id);

  if (discount) {
    res.json(discount);
  } else {
    res.status(404).send('Discount not found');
  }
};

// @desc    Create a discount
// @route   POST /api/discounts
// @access  Private/Admin
const createDiscount = async (req, res) => {
  const { code, description, discountType, discountValue, isActive } = req.body;

  const discount = new Discount({
    code,
    description,
    discountType,
    discountValue,
    isActive,
  });

  const createdDiscount = await discount.save();
  res.status(201).json(createdDiscount);
};

// @desc    Update a discount
// @route   PUT /api/discounts/:id
// @access  Private/Admin
const updateDiscount = async (req, res) => {
  const { code, description, discountType, discountValue, isActive } = req.body;

  const discount = await Discount.findById(req.params.id);

  if (discount) {
    discount.code = code;
    discount.description = description;
    discount.discountType = discountType;
    discount.discountValue = discountValue;
    discount.isActive = isActive;

    const updatedDiscount = await discount.save();
    res.json(updatedDiscount);
  } else {
    res.status(404).send('Discount not found');
  }
};

// @desc    Delete a discount
// @route   DELETE /api/discounts/:id
// @access  Private/Admin
const deleteDiscount = async (req, res) => {
  const discount = await Discount.findById(req.params.id);

  if (discount) {
    await discount.remove();
    res.json({ message: 'Discount removed' });
  } else {
    res.status(404).send('Discount not found');
  }
};

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
