// config/db.js

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
