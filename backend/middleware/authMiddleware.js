const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ msg: 'Authorization denied, user not found' });
        }

        req.user = user;

        next();
    } catch (err) {
        console.error('Token is not valid:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
