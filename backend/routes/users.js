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

router.post('/create', authMiddleware, validateUserRegistration, handleValidationErrors, createUser);

router.put('/update/:id', authMiddleware, updateUser);

router.put('/assign-roles', authMiddleware, assignRoles);

router.get('/', authMiddleware, getUsers);

router.get('/:id', authMiddleware, getUserById);

router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
