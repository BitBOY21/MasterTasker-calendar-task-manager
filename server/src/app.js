const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- Security Middleware ---
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// Standard Middleware
app.use(express.json());
app.use(cors());

// Logging Middleware (Only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- Routes Configuration ---

// 1. Health Check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'SmartTasker API is running...' });
});

// 2. API Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 3. Error Handling Middleware (Must be last)
app.use(errorHandler);

module.exports = app;