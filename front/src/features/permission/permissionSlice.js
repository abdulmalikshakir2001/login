import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; // Assuming axios instance is set up

// Fetch all permissions
export const fetchPermissions = createAsyncThunk('permissions/fetchPermissions', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/permissions');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions');
  }
});

// Create a permission
export const createPermission = createAsyncThunk('permissions/createPermission', async (permissionData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/permissions/create', permissionData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create permission');
  }
});

// Update a permission
export const updatePermission = createAsyncThunk('permissions/updatePermission', async ({ permissionId, permissionData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/permissions/update/${permissionId}`, permissionData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update permission');
  }
});

// Delete a permission
export const deletePermission = createAsyncThunk('permissions/deletePermission', async (permissionId, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/permissions/${permissionId}`);
    return permissionId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete permission');
  }
});

// Permission slice
const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissions: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch permissions
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

      // Create permission
      .addCase(createPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload.permission); // Add the new permission
      })

      // Update permission
      .addCase(updatePermission.fulfilled, (state, action) => {
        const index = state.permissions.findIndex(p => p._id === action.payload.permission._id);
        if (index !== -1) {
          state.permissions[index] = action.payload.permission;
        }
      })

      // Delete permission
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter(p => p._id !== action.payload);
      });
  },
});

export default permissionSlice.reducer;
