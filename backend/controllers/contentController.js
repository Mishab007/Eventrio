
const Content = require('../models/contentModel.js');

// @desc    Fetch all contents
// @route   GET /api/contents
// @access  Public
const getContents = async (req, res) => {
  const contents = await Content.find({});
  res.json(contents);
};

// @desc    Fetch single content
// @route   GET /api/contents/:id
// @access  Public
const getContentById = async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (content) {
    res.json(content);
  } else {
    res.status(404).send('Content not found');
  }
};

// @desc    Create a content
// @route   POST /api/contents
// @access  Private/Admin
const createContent = async (req, res) => {
  const { name, contentType, content } = req.body;

  const newContent = new Content({
    name,
    contentType,
    content,
  });

  const createdContent = await newContent.save();
  res.status(201).json(createdContent);
};

// @desc    Update a content
// @route   PUT /api/contents/:id
// @access  Private/Admin
const updateContent = async (req, res) => {
  const { name, contentType, content } = req.body;

  const contentToUpdate = await Content.findById(req.params.id);

  if (contentToUpdate) {
    contentToUpdate.name = name;
    contentToUpdate.contentType = contentType;
    contentToUpdate.content = content;

    const updatedContent = await contentToUpdate.save();
    res.json(updatedContent);
  } else {
    res.status(404).send('Content not found');
  }
};

// @desc    Delete a content
// @route   DELETE /api/contents/:id
// @access  Private/Admin
const deleteContent = async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (content) {
    await content.remove();
    res.json({ message: 'Content removed' });
  } else {
    res.status(404).send('Content not found');
  }
};

module.exports = {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
};
