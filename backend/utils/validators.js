const { check, validationResult } = require('express-validator');

const validateUserRegistration = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const validateUserLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

const validateRole = [
    check('name', 'Role name is required').not().isEmpty(),
    check('permissions', 'Permissions must be an array').isArray()
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateRole,
    handleValidationErrors
};
