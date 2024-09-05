import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole
} from 'features/role/roleSlice';

const Role = () => {
  const dispatch = useDispatch();
  const { roles, status, error } = useSelector((state) => state.roles);

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({ name: '', permissions: {} });

  // Permissions modules, fetched from backend in a real scenario
  const modules = [
    { name: 'User', permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
    { name: 'Client', permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
    { name: 'Product', permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
    { name: 'Project', permissions: ['Manage', 'Create', 'Edit', 'Delete'] },
  ];

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRoles());
    }
  }, [dispatch, status]);

  const handlePermissionChange = (module, permission) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [permission]: !prev.permissions[module]?.[permission],
        },
      },
    }));
  };

  const handleCreateRole = async () => {
    try {
      await dispatch(createRole(newRole)).unwrap();
      dispatch(fetchRoles());
      setIsCreating(false);
      setNewRole({ name: '', permissions: {} });
    } catch (err) {
      console.error('Error creating role:', err);
    }
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setNewRole(role);
    setIsEditing(true);
  };

  const handleUpdateRole = async () => {
    try {
      await dispatch(updateRole({ roleId: selectedRole._id, roleData: newRole })).unwrap();
      dispatch(fetchRoles());
      setIsEditing(false);
      setNewRole({ name: '', permissions: {} });
      setSelectedRole(null);
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await dispatch(deleteRole(roleId)).unwrap();
        dispatch(fetchRoles());
      } catch (err) {
        console.error('Error deleting role:', err);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Roles</h1>
        <button
          className="bg-green-500 text-white rounded-full p-2"
          onClick={() => setIsCreating(true)}
        >
          <FaPlus className="inline" /> {/* Plus icon for creating new roles */}
        </button>
      </div>

      {/* Role List */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Permissions</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {status === 'loading' ? (
            <tr>
              <td colSpan="3" className="py-4 px-4 text-center text-gray-600">
                Loading...
              </td>
            </tr>
          ) : roles.length > 0 ? (
            roles.map((role) => (
              <tr key={role._id} className="border-b">
                <td className="py-2 px-4">{role.name}</td>
                <td className="py-2 px-4 flex flex-wrap">
                  {Object.keys(role.permissions).map((module) => (
                    <div key={module}>
                      <strong>{module}: </strong>
                      {Object.keys(role.permissions[module])
                        .filter((perm) => role.permissions[module][perm])
                        .map((perm) => (
                          <span
                            key={perm}
                            className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-sm m-1"
                          >
                            {perm}
                          </span>
                        ))}
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="text-blue-500 mx-2"
                    onClick={() => handleEditRole(role)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 mx-2"
                    onClick={() => handleDeleteRole(role._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 px-4 text-center text-gray-600">
                No roles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Create/Edit Role Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl mb-4">{isCreating ? 'Create Role' : 'Edit Role'}</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Role Name</label>
              <input
                type="text"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Permissions Table */}
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">Module</th>
                  <th className="py-2 px-4">Manage</th>
                  <th className="py-2 px-4">Create</th>
                  <th className="py-2 px-4">Edit</th>
                  <th className="py-2 px-4">Delete</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.name}>
                    <td className="py-2 px-4">{module.name}</td>
                    {module.permissions.map((perm) => (
                      <td className="py-2 px-4" key={perm}>
                        <input
                          type="checkbox"
                          checked={!!newRole.permissions[module.name]?.[perm]}
                          onChange={() =>
                            handlePermissionChange(module.name, perm)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Actions */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setNewRole({ name: '', permissions: {} });
                  setSelectedRole(null);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={isCreating ? handleCreateRole : handleUpdateRole}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {isCreating ? 'Create Role' : 'Update Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-500">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default Role;
