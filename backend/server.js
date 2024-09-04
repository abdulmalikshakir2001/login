const express = require('express');
const connectDB = require('./config/db.js');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const errorHandler = require('./utils/errorHandler.js');
const cors = require('cors'); // Import cors

const app = express();

connectDB();

// Use CORS with default options for all routes
// This will allow all cross-origin requests
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

// All Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/roles', require('./routes/roles.js'));
app.use('/api/permissions', require('./routes/permissions.js'));
app.use('/api/users', require('./routes/users.js'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
