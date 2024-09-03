const Permission = require('../models/Permission.js');

exports.createPermission = async (req, res) => {
    const { name, module } = req.body;

    try {
        let permission = await Permission.findOne({ name });
        if (permission) {
            return res.status(400).json({ msg: 'Permission already exists' });
        }

        permission = new Permission({
            name,
            module
        });

        await permission.save();
        res.status(201).json({
            msg: 'Permission created successfully',
            permission
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updatePermission = async (req, res) => {
    const { permissionId, name, module } = req.body;

    try {
        let permission = await Permission.findById(permissionId);
        if (!permission) {
            return res.status(404).json({ msg: 'Permission not found' });
        }

        permission.name = name || permission.name;
        permission.module = module || permission.module;

        await permission.save();
        res.status(200).json({
            msg: 'Permission updated successfully',
            permission
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json(permissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getPermissionById = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) {
            return res.status(404).json({ msg: 'Permission not found' });
        }
        res.status(200).json(permission);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) {
            return res.status(404).json({ msg: 'Permission not found' });
        }

        await permission.remove();
        res.status(200).json({ msg: 'Permission removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
