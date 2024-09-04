import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; // Assuming you have an axios instance set up

// Fetch users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  if (!token) {
    return rejectWithValue('No token found, authorization denied');
  }

  try {
    const response = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Assuming response.data contains the array of users
  } catch (error) {
    console.error('Error fetching users:', error.response);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

// Create a user
export const createUser = createAsyncThunk('users/createUser', async (userData, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  try {
    const response = await axios.post('/api/users/create', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create user');
  }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, userData }, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  try {
    // Use the correct URL format with the userId
    const response = await axios.put(`/api/users/update/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update user');
  }
});


// Delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    const token = getState().auth.token; // Get token from state

    if (!token) {
      return rejectWithValue('Authorization token is missing');
    }

    try {
      // Make delete request with authorization token
      await axios.delete(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Return the ID of the deleted user
      return { id: userId };
    } catch (error) {
      // Return error message if request fails
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      return rejectWithValue(errorMessage);
    }
  }
);



// Create the users slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear any previous error
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload; // Set the fetched users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch users'; // Set the error message
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload); // Add the new user to the list
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create user';
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload; // Update the user
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update user';
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user._id !== action.payload.id); // Use _id for MongoDB
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete user';
      });
  },
});

export default usersSlice.reducer;
