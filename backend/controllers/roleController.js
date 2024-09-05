const Role = require('../models/Role.js');
const Permission = require('../models/Permission.js');
const RoleHasPermissions = require('../models/RoleHasPermissions.js');

// Create a role
// Create a role
exports.createRole = async (req, res) => {
    const { name, permissions } = req.body;
  
    try {
      let role = await Role.findOne({ name });
      if (role) {
        return res.status(400).json({ msg: 'Role already exists' });
      }
  
      role = new Role({ name });
      await role.save();
  
      if (permissions && permissions.length > 0) {
        for (const permissionId of permissions) {
          await RoleHasPermissions.create({
            role_id: role._id,
            permission_id: permissionId
          });
        }
      }
  
      const populatedRole = await Role.findById(role._id).populate({
        path: 'permissions',
        model: 'RoleHasPermissions',
        populate: {
          path: 'permission_id',
          model: 'Permission'
        }
      });
  
      res.status(201).json({
        msg: 'Role created successfully',
        role: populatedRole
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  

// Update a role
exports.updateRole = async (req, res) => {
    const { roleId, name, permissions } = req.body;
  
    try {
      let role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ msg: 'Role not found' });
      }
  
      // Update role name if provided
      if (name) {
        role.name = name;
      }
      await role.save();
  
      // Delete all previous role-permission associations
      await RoleHasPermissions.deleteMany({ role_id: roleId });
  
      // Add new permissions
      if (permissions && permissions.length > 0) {
        for (const permissionId of permissions) {
          await RoleHasPermissions.create({
            role_id: role._id,
            permission_id: permissionId
          });
        }
      }
  
      const updatedRole = await Role.findById(roleId).populate({
        path: 'permissions',
        model: 'RoleHasPermissions',
        populate: {
          path: 'permission_id',
          model: 'Permission'
        }
      });
  
      res.status(200).json({
        msg: 'Role updated successfully',
        role: updatedRole
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  

// Get all roles
exports.getRoles = async (req, res) => {
    try {
      const roles = await Role.find().populate({
        path: 'permissions',
        model: 'RoleHasPermissions',
        populate: {
          path: 'permission_id',
          model: 'Permission'
        }
      });
      res.status(200).json(roles);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
  
  

// Get a single role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate({
            path: 'permissions',
            model: 'RoleHasPermissions',
            populate: {
                path: 'permission_id',
                model: 'Permission'
            }
        });
        if (!role) {
            return res.status(404).json({ msg: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Delete a role
exports.deleteRole = async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ msg: 'Role not found' });
      }
  
      // Delete all role-permission associations
      await RoleHasPermissions.deleteMany({ role_id: role._id });
  
      // Delete the role
      await role.remove();
  
      res.status(200).json({ msg: 'Role removed successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  