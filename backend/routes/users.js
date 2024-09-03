// routes/users.js

const express = require('express');
const router = express.Router();
const {
    createUser,
    updateUser,
    assignRoles,
    getUsers,
    getUserById,
    deleteUser
} = require('../controllers/userController.js');
const { validateUserRegistration, handleValidationErrors } = require('../utils/validators.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// Create a new user
router.post('/create', authMiddleware, validateUserRegistration, handleValidationErrors, createUser);

// Update an existing user
router.put('/update', authMiddleware, updateUser);

// Assign roles to a user
router.put('/assign-roles', authMiddleware, assignRoles);

// Get all users
router.get('/', authMiddleware, getUsers);

// Get a single user by ID
router.get('/:id', authMiddleware, getUserById);

// Delete a user
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
