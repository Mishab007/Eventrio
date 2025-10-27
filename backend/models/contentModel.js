
const mongoose = require('mongoose');

const contentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ['banner', 'text', 'image'],
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
