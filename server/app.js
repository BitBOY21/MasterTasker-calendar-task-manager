const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const seedData = require('./src/utils/seedData'); // Import the seeder

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- Routes Configuration ---

// 1. Health Check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'SmartTasker API is running...' });
});

// 2. API Routes
app.use('/api/tasks', require('./src/routes/taskRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    
    // Run the seeder on startup
    try {
        await seedData();
    } catch (error) {
        console.error('Seeding failed:', error);
    }
});