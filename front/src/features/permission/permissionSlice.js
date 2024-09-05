import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Fetch Permissions
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token; // Get the token from the auth state
    try {
      const response = await axios.get('/api/permissions/', {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions');
    }
  }
);

// Create Permission
export const createPermission = createAsyncThunk(
  'permissions/createPermission',
  async (permissionData, { getState, rejectWithValue }) => {
    const token = getState().auth.token; // Get the token from the auth state
    try {
      const response = await axios.post('/api/permissions/create', permissionData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create permission');
    }
  }
);

// Update Permission
export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ permissionId, permissionData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token; // Get the token from the auth state
    try {
      const response = await axios.put(`/api/permissions/update/${permissionId}`, permissionData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update permission');
    }
  }
);

// Delete Permission
export const deletePermission = createAsyncThunk(
  'permissions/deletePermission',
  async (permissionId, { getState, rejectWithValue }) => {
    const token = getState().auth.token; // Get the token from the auth state
    try {
      await axios.delete(`/api/permissions/${permissionId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      return { id: permissionId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete permission');
    }
  }
);

// Permission slice
const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissions: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload);
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        const index = state.permissions.findIndex((perm) => perm._id === action.payload._id);
        if (index !== -1) {
          state.permissions[index] = action.payload;
        }
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter((perm) => perm._id !== action.payload.id);
      });
  },
});

export default permissionSlice.reducer;
