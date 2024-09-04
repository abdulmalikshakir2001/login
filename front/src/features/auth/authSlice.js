import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios.js';

// Utility to store the token in localStorage
const storeToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  }
};

// Utility to remove the token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Sign-in action
export const signIn = createAsyncThunk(
  'auth/sign-in',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      storeToken(token); // Store token in localStorage
      return { user, token }; // Return the user and token data
    } catch (error) {
      console.error('Error response:', error.response?.data?.errors);
      return rejectWithValue(error.response?.data || 'An unexpected error occurred');
    }
  }
);

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });
      const { token, user } = response.data;
      storeToken(token); // Store token in localStorage
      return { user, token }; // Return the user and token data
    } catch (error) {
      console.error('Error response:', error.response);
      return rejectWithValue(error.response.data || 'Failed to register');
    }
  }
);

// Logout action (optional to clear the token)
export const logout = createAsyncThunk('auth/logout', async () => {
  removeToken(); // Clear the token from localStorage
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    token: localStorage.getItem('token') || null, // Retrieve token from localStorage if available
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Sign-in cases
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.token = null; // Clear token on failure
      })

      // Register cases
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to register';
        state.token = null; // Clear token on failure
      })

      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null; // Clear the token and user data on logout
      });
  },
});

export default authSlice.reducer;
