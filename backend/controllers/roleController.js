const Role = require('../models/Role.js');
const Permission = require('../models/Permission.js');

exports.createRole = async (req, res) => {
    const { name, permissions } = req.body;

    try {
        let role = await Role.findOne({ name });
        if (role) {
            return res.status(400).json({ msg: 'Role already exists' });
        }

        role = new Role({
            name,
            permissions
        });

        await role.save();
        res.status(201).json({
            msg: 'Role created successfully',
            role
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateRole = async (req, res) => {
    const { roleId, permissions } = req.body;

    try {
        let role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ msg: 'Role not found' });
        }

        role.permissions = permissions;
        await role.save();
        res.status(200).json({
            msg: 'Role updated successfully',
            role
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.status(200).json(roles);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate('permissions');
        if (!role) {
            return res.status(404).json({ msg: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ msg: 'Role not found' });
        }

        await role.remove();
        res.status(200).json({ msg: 'Role removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
