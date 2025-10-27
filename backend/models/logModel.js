
const mongoose = require('mongoose');

const logSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
