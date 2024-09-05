import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import {
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
} from 'features/permission/permissionSlice';

const Permission = () => {
    const dispatch = useDispatch();
    const { permissions, status, error } = useSelector((state) => state.permissions);

    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [newPermission, setNewPermission] = useState({ name: '', module: '' });

    // Fetch permissions when the component mounts
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPermissions());
        }
    }, [dispatch, status]);

    // Handle creating a new permission
    const handleCreatePermission = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createPermission(newPermission)).unwrap(); // Create new permission
            dispatch(fetchPermissions()); // Fetch updated permissions after creation
            setIsCreating(false);
            setNewPermission({ name: '', module: '' });
        } catch (err) {
            console.error('Error creating permission:', err);
        }
    };

    // Handle editing an existing permission
    const handleEditPermission = (permission) => {
        setSelectedPermission(permission);
        setNewPermission({ ...permission });
        setIsEditing(true);
    };

    // Handle updating a permission
    const handleUpdatePermission = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updatePermission({ permissionId: selectedPermission._id, permissionData: newPermission })).unwrap();
            dispatch(fetchPermissions()); // Fetch updated permissions after updating
            setIsEditing(false);
            setNewPermission({ name: '', module: '' });
            setSelectedPermission(null);
        } catch (err) {
            console.error('Error updating permission:', err);
        }
    };

    // Handle deleting a permission
    const handleDeletePermission = async (permissionId) => {
        if (window.confirm('Are you sure you want to delete this permission?')) {
            try {
                await dispatch(deletePermission(permissionId)).unwrap(); // Delete permission
                dispatch(fetchPermissions()); // Fetch updated permissions after deletion
            } catch (err) {
                console.error('Error deleting permission:', err);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Permissions</h1>
                <button
                    className="bg-green-500 text-white rounded-full p-2"
                    onClick={() => setIsCreating(true)}
                >
                    <FaPlus className="inline" /> {/* Plus icon for creating new permissions */}
                </button>
            </div>

            {/* Permission List */}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4">Permission Name</th>
                        <th className="py-2 px-4">Module</th>
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
                    ) : permissions.length > 0 ? (
                        permissions.map((permission, index) => (
                            <tr key={permission._id || index} className="border-b">
                                <td className="py-2 px-4">{permission.name}</td>
                                <td className="py-2 px-4">{permission.module}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className="text-blue-500 mx-2"
                                        onClick={() => handleEditPermission(permission)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="text-red-500 mx-2"
                                        onClick={() => handleDeletePermission(permission._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="py-4 px-4 text-center text-gray-600">
                                No permissions found.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>

            {/* Create/Edit Permission Modal */}
            {(isCreating || isEditing) && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl mb-4">
                            {isCreating ? 'Create Permission' : 'Edit Permission'}
                        </h2>
                        <form onSubmit={isCreating ? handleCreatePermission : handleUpdatePermission}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Permission Name</label>
                                <input
                                    type="text"
                                    value={newPermission.name}
                                    onChange={(e) =>
                                        setNewPermission({ ...newPermission, name: e.target.value })
                                    }
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Module</label>
                                <input
                                    type="text"
                                    value={newPermission.module}
                                    onChange={(e) =>
                                        setNewPermission({ ...newPermission, module: e.target.value })
                                    }
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setIsEditing(false);
                                        setNewPermission({ name: '', module: '' });
                                        setSelectedPermission(null);
                                    }}
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    {isCreating ? 'Create Permission' : 'Update Permission'}
                                </button>
                            </div>
                        </form>
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

export default Permission;
