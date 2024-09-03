const express = require('express');
const router = express.Router();
const {
    createRole,
    updateRole,
    getRoles,
    getRoleById,
    deleteRole
} = require('../controllers/roleController');
const { validateRole, handleValidationErrors } = require('../utils/validators');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, validateRole, handleValidationErrors, createRole);
router.put('/update', authMiddleware, validateRole, handleValidationErrors, updateRole);
router.get('/', authMiddleware, getRoles);
router.get('/:id', authMiddleware, getRoleById);
router.delete('/:id', authMiddleware, deleteRole);

module.exports = router;
