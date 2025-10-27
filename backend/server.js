const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const discountRoutes = require('./routes/discountRoutes.js');
const contentRoutes = require('./routes/contentRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');

dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Configure CORS to allow the Vite dev server with credentials
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost requests from any port during development
    if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // For production, only allow specific origins
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        // Add your production domain here
      ];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise Rejection');
  process.exit(1);
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});