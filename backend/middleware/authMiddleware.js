const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const authMiddleware = async (req, res, next) => {
    try {
        // Check if the Authorization header is present
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Remove the 'Bearer ' prefix and extract the token
        const token = authHeader.replace('Bearer ', '');

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the ID from the decoded token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ msg: 'Authorization denied, user not found' });
        }

        // Attach the user to the request object
        req.user = user;

        next();
    } catch (err) {
        console.error('Token is not valid:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
