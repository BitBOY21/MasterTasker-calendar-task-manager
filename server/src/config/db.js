const mongoose = require('mongoose');

/**
 * Connects to the MongoDB Database using Mongoose.
 * This function handles the connection logic asynchronously.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the database using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If connection fails, log the error and exit the process with failure code (1)
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;