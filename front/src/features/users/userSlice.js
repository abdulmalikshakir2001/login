// src/features/users/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; // Assuming you have an axios instance set up

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  if (!token) {
    return rejectWithValue('No token found, authorization denied');
  }

  try {
    const response = await axios.get('/api/users', { // Change this to /api/users
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the headers
      },
    });
    return response.data; // Assuming response.data contains the array of users
  } catch (error) {
    console.error('Error fetching users:', error.response);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});


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
        state.error = action.payload || 'Something went wrong'; // Set the error message
      });
  },
});

export default usersSlice.reducer;
