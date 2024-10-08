import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token; 
    try {
      const response = await axios.get('/api/permissions/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions');
    }
  }
);

export const createPermission = createAsyncThunk(
  'permissions/createPermission',
  async (permissionData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post('/api/permissions/create', permissionData, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create permission');
    }
  }
);

export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ permissionId, permissionData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token; 
    try {
      const response = await axios.put(`/api/permissions/update/${permissionId}`, permissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update permission');
    }
  }
);


export const deletePermission = createAsyncThunk(
  'permissions/deletePermission',
  async (permissionId, { getState, rejectWithValue }) => {
    const token = getState().auth.token; 
    try {
      await axios.delete(`/api/permissions/${permissionId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return { id: permissionId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete permission');
    }
  }
);

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
