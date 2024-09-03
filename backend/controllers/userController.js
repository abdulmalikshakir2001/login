const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const Role = require('../models/Role.js');

exports.createUser = async (req, res) => {
    const { name, email, password, roles } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            email,
            password: hashedPassword,
            roles
        });

        await user.save();
        res.status(201).json({
            msg: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { userId, name, email, roles } = req.body;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.roles = roles || user.roles;

        await user.save();
        res.status(200).json({
            msg: 'User updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.assignRoles = async (req, res) => {
    const { userId, roles } = req.body;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.roles = roles;
        await user.save();
        res.status(200).json({
            msg: 'Roles assigned successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('roles');
        res.status(200).json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('roles');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.remove();
        res.status(200).json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
