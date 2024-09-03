const express = require('express');
const router = express.Router();
const {
    createPermission,
    updatePermission,
    getPermissions,
    getPermissionById,
    deletePermission
} = require('../controllers/permissionController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/create', authMiddleware, createPermission);
router.put('/update', authMiddleware, updatePermission);
router.get('/', authMiddleware, getPermissions);
router.get('/:id', authMiddleware, getPermissionById);
router.delete('/:id', authMiddleware, deletePermission);

module.exports = router;
