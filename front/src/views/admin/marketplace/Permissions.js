import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import {
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
} from 'features/permission/permissionSlice';
import Modal from './Modal'; // Assuming Modal is in the same folder

const Permission = () => {
    const dispatch = useDispatch();
    const { permissions, status, error } = useSelector((state) => state.permissions);

    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [newPermission, setNewPermission] = useState({ name: '', modules: [] });

    const availableModules = ['User', 'Admin', 'Project', 'Product']; 

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPermissions());
        }
    }, [dispatch, status]);

    const handleCreatePermission = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createPermission(newPermission)).unwrap(); 
            dispatch(fetchPermissions());
            setIsCreating(false);
            setNewPermission({ name: '', modules: [] });
        } catch (err) {
            console.error('Error creating permission:', err);
        }
    };

    const handleEditPermission = (permission) => {
        setSelectedPermission(permission);
        setNewPermission({ ...permission });
        setIsEditing(true);
    };

    const handleUpdatePermission = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updatePermission({ permissionId: selectedPermission._id, permissionData: newPermission })).unwrap();
            dispatch(fetchPermissions());
            setIsEditing(false);
            setNewPermission({ name: '', modules: [] });
            setSelectedPermission(null);
        } catch (err) {
            console.error('Error updating permission:', err);
        }
    };

    const handleDeletePermission = async () => {
        try {
            await dispatch(deletePermission(permissionToDelete)).unwrap(); 
            dispatch(fetchPermissions());
            setShowDeleteModal(false); // Close the modal after deletion
            setPermissionToDelete(null); // Clear selected permission to delete
        } catch (err) {
            console.error('Error deleting permission:', err);
        }
    };

    const openDeleteModal = (permissionId) => {
        setPermissionToDelete(permissionId);
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setPermissionToDelete(null);
    };

    const handleModuleChange = (module) => {
        setNewPermission((prev) => ({
            ...prev,
            modules: prev.modules.includes(module)
                ? prev.modules.filter((mod) => mod !== module)
                : [...prev.modules, module],
        }));
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

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4">Permission Name</th>
                        <th className="py-2 px-4">Modules</th>
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
                                <td className="py-2 px-4">{permission.modules?.join(', ') || 'No Modules'}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className="text-blue-500 mx-2"
                                        onClick={() => handleEditPermission(permission)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="text-red-500 mx-2"
                                        onClick={() => openDeleteModal(permission._id)}
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

                            {/* Modules Selector */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Modules</label>
                                {availableModules.map((module) => (
                                    <div key={module} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={newPermission.modules.includes(module)}
                                            onChange={() => handleModuleChange(module)}
                                            className="mr-2"
                                        />
                                        <span>{module}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setIsEditing(false);
                                        setNewPermission({ name: '', modules: [] });
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal
                    title="Confirm Delete"
                    onConfirm={handleDeletePermission}
                    onClose={handleCloseModal}
                    confirmText="Delete"
                    cancelText="Cancel"
                >
                    <p>Are you sure you want to delete this permission?</p>
                </Modal>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-500">
                    Error: {error}
                </div>
            )}
        </div>
    );
};

export default Permission;
