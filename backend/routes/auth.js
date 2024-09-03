const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController.js');
const { validateUserRegistration, validateUserLogin, handleValidationErrors } = require('../utils/validators.js');

router.post('/register', validateUserRegistration, handleValidationErrors, register);
router.post('/login', validateUserLogin, handleValidationErrors, login);

module.exports = router;
