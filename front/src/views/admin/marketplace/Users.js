import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, updateUser, createUser } from 'features/users/userSlice'; // Import necessary actions
import moment from 'moment'; // Optionally for date formatting
import { FaPlus, FaEllipsisV } from 'react-icons/fa'; // Import FontAwesome icons
import Modal from './Modal'; // Import the Modal component

// Reusable UserCard component with 3-dotted dropdown
const UserCard = ({ role, name, email, date, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false); // State to toggle dropdown menu

    const handleMenuToggle = () => {
        setShowMenu(!showMenu); // Toggle dropdown visibility
    };

    const handleMenuClose = () => {
        setShowMenu(false); // Close dropdown
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 text-center relative">
            <div className="bg-green-200 text-green-700 text-sm font-semibold py-1 px-3 rounded-full mb-2">
                {Array.isArray(role) ? role.map(r => r?.name || 'N/A').join(', ') : role || 'N/A'} {/* Handle role array */}
            </div>
            <h2 className="text-lg font-bold">{name || 'Unnamed User'}</h2> {/* Fallback for name */}
            <p className="text-sm text-gray-500">{email || 'No email'}</p> {/* Fallback for email */}
            {date && <p className="text-sm text-gray-400 mt-2">{moment(date).format('LLL')}</p>} {/* Format date */}

            {/* 3-Dotted Menu */}
            <div className="absolute top-2 right-2">
                <button onClick={handleMenuToggle} className="text-gray-500 hover:text-gray-700">
                    <FaEllipsisV />
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10">
                        <button onClick={onEdit} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            Edit
                        </button>
                        <button onClick={onDelete} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Close dropdown when clicking outside */}
            {showMenu && <div onClick={handleMenuClose} className="fixed inset-0 z-0" />}
        </div>
    );
};

const Users = () => {
    const dispatch = useDispatch();
    const { users, status, error } = useSelector((state) => state.users); // Access the users, status, and error from Redux

    const [isEditing, setIsEditing] = useState(false); // State to track if editing
    const [isCreating, setIsCreating] = useState(false); // State to track if creating
    const [selectedUser, setSelectedUser] = useState(null); // State to hold selected user for editing
    const [isDeleting, setIsDeleting] = useState(false); // State to track if deleting
    const [userToDelete, setUserToDelete] = useState(null); // State to hold user to delete

    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', roles: '' }); // State for new user

    // Fetch users when the component mounts
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers());
        }
    }, [dispatch, status]);

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditing(true); // Open the edit modal
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user); // Set the user to delete
        setIsDeleting(true); // Open the confirmation modal
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            dispatch(deleteUser(userToDelete._id || userToDelete.id)).then(() => {
                setIsDeleting(false); // Close the modal after deletion
                setUserToDelete(null); // Clear the selected user
                dispatch(fetchUsers()); // Refetch users after deletion
            });
        }
    };

    const handleUpdateUser = (updatedData) => {
        if (selectedUser) {
            const userId = selectedUser._id || selectedUser.id; // Ensure the ID is correct
            dispatch(updateUser({ userId, userData: updatedData })).then(() => {
                setIsEditing(false); // Close the modal after update
                setSelectedUser(null); // Clear the selected user
                dispatch(fetchUsers()); // Fetch updated users after update
            });
        }
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
    
        const formData = {
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            roles: newUser.roles ? [newUser.roles] : [], // Assuming roles is a single value
        };
    
        console.log('Form Data:', formData); // Log form data for verification
    
        dispatch(createUser(formData)).then(() => {
            setIsCreating(false); // Close the modal after creation
            dispatch(fetchUsers()); // Refetch users after creation
            setNewUser({ name: '', email: '', password: '', roles: '' }); // Clear form after submit
        });
    };

    // Update form fields for creating a new user
    const handleInputChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
    };

    // Render loading state
    if (status === 'loading') {
        return <div>Loading users...</div>;
    }

    // Render error state
    if (status === 'failed') {
        return <div>Error: {error || 'Failed to load users'}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <button className="bg-green-500 text-white rounded-full p-2" onClick={() => setIsCreating(true)}>
                    <FaPlus className="inline" /> {/* Plus icon for creating new users */}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <UserCard
                            key={user._id || user.id || index} // Ensure that _id or id is unique
                            role={user.roles || 'User'}
                            name={user.name}
                            email={user.email}
                            date={user.createdAt}
                            onEdit={() => handleEditUser(user)}
                            onDelete={() => handleDeleteUser(user)}
                        />
                    ))
                ) : (
                    <div className="text-center w-full">No users found</div>
                )}
            </div>

            {/* Create User Modal */}
            {isCreating && (
                <Modal
                    title="Create New User"
                    onConfirm={handleCreateUser} // Pass the handleCreateUser function
                    onClose={() => setIsCreating(false)}
                    confirmText="Create"
                    cancelText="Cancel"
                >
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full p-2 border rounded"
                                value={newUser.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full p-2 border rounded"
                                value={newUser.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full p-2 border rounded"
                                value={newUser.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Role</label>
                            <input
                                type="text"
                                name="roles"
                                className="w-full p-2 border rounded"
                                value={newUser.roles}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Modal Logic */}
            {isEditing && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl mb-4">Edit User</h2>
                        {/* Sample form for updating */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const updatedData = {
                                    name: e.target.name.value,
                                    email: e.target.email.value,
                                    // Add more fields as needed
                                };
                                handleUpdateUser(updatedData); // Call update handler
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedUser.name}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={selectedUser.email}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Update User
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="ml-4 bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleting && userToDelete && (
                <Modal
                    title="Delete User"
                    onConfirm={confirmDeleteUser}
                    onClose={() => setIsDeleting(false)}
                    confirmText="Delete"
                    cancelText="Cancel"
                >
                    <p>Are you sure you want to delete {userToDelete.name}?</p>
                </Modal>
            )}
        </div>
    );
};

export default Users;
