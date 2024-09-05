// File: middleware/roleMiddleware.js
const Role = require('../models/Role.js');

const roleMiddleware = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      // Assume you have `req.user` populated with user information (from auth middleware)
      const userRole = await Role.findById(req.user.role).populate('permissions');

      if (!requiredRoles.includes(userRole.name)) {
        return res.status(403).json({ msg: 'Access denied. Insufficient permissions.' });
      }

      next(); // User has the right role, proceed to the next middleware/controller
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  };
};

module.exports = roleMiddleware;
