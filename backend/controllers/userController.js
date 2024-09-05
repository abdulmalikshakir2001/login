const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const Role = require('../models/Role.js');

exports.createUser = async (req, res) => {
    const { name, email, password, roles } = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please provide name, email, and password' });
        }

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // If roles are provided, ensure that the roles exist in the Role collection
        let assignedRoles = [];
        if (roles && roles.length > 0) {
            const roleRecords = await Role.find({ name: { $in: roles } });
            if (!roleRecords || roleRecords.length !== roles.length) {
                return res.status(400).json({ msg: 'One or more roles are invalid' });
            }
            assignedRoles = roleRecords.map(role => role._id); // Assign role IDs
        }

        // Create a new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            roles: assignedRoles.length > 0 ? assignedRoles : undefined // Only set roles if provided
        });

        // Save the new user to the database
        await user.save();

        // Return a success response
        res.status(201).json({
            msg: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: assignedRoles // Optionally include role names or IDs
            }
        });
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { name, email, roles } = req.body; // Only these should be in the body
    const { id } = req.params;  // Get user ID from URL params

    try {
        let user = await User.findById(id);  // Find the user by the ID from the URL
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        user.roles = roles || user.roles;

        await user.save();  // Save the updated user

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
        // Fetch users and populate the 'roles' field from the Role model
        const users = await User.find().populate('roles', 'name'); // Assuming 'roles' field exists in User schema and it is linked to Role schema.

        // If no users found, return a message
        if (users.length === 0) {
            return res.status(404).json({ msg: 'No users found' });
        }

        // Return the users with a success status
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err.message);
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
      const { id } = req.params; // Get the user ID from the URL parameters
      console.log(`Attempting to delete user with ID: ${id}`);
  
      const user = await User.findById(id); // Find the user by ID
      if (!user) {
        console.log(`User with ID ${id} not found.`);
        return res.status(404).json({ message: 'User not found' }); // If user not found, return 404
      }
  
      await User.findByIdAndDelete(id); // Use findByIdAndDelete to delete the user
      
      return res.status(200).json({ message: 'User deleted successfully', id }); // Return success message and user ID
    } catch (error) {
      console.error('Error deleting user:', error.message);
      return res.status(500).json({ message: 'Server error' }); // Catch any errors and return server error
    }
  };
  
  