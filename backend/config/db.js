const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Please make sure MongoDB is installed and running.');
    console.error('You can download MongoDB from https://www.mongodb.com/try/download/community');
    process.exit(1);
  }
};

module.exports = connectDB;