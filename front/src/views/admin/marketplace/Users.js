import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'features/users/userSlice'; // Import the fetchUsers action
import moment from 'moment'; // Optionally for date formatting
import { FaPlus, FaEllipsisV } from 'react-icons/fa'; // Import FontAwesome icons

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
        {Array.isArray(role) ? role.map(r => r.name).join(', ') : role || 'N/A'} {/* Handle role array */}
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

  // Fetch users when the component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  const handleEditUser = (user) => {
    // Implement user edit logic here
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (userId) => {
    // Implement user delete logic here
    console.log('Delete user ID:', userId);
  };

  // Render loading state
  if (status === 'loading') {
    return <div>Loading users...</div>;
  }

  // Render error state
  if (status === 'failed') {
    return <div>Error: {error || 'Failed to load users'}</div>;
  }

  // Render the user cards once data is fetched
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button className="bg-green-500 text-white rounded-full p-2">
          <FaPlus className="inline" /> {/* Plus icon for creating new users */}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard
              key={user._id || user.id} // Use _id or id as the key, depending on your DB
              role={user.roles || 'User'} // Adjust based on how roles are structured
              name={user.name}
              email={user.email}
              date={user.createdAt} // Assuming `createdAt` is the field for the registration date
              onEdit={() => handleEditUser(user)} // Pass edit handler
              onDelete={() => handleDeleteUser(user._id || user.id)} // Pass delete handler
            />
          ))
        ) : (
          <div className="text-center w-full">No users found</div>
        )}
      </div>
    </div>
  );
};

export default Users;
