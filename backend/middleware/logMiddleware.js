
const Log = require('../models/logModel.js');

const logAction = (action, details) => async (req, res, next) => {
  try {
    const log = new Log({
      user: req.user._id,
      action,
      details,
    });
    await log.save();
    next();
  } catch (error) {
    console.error(error);
    next();
  }
};

module.exports = logAction;
