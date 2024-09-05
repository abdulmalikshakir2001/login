// src/features/role/roleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; // Assuming you have an axios instance set up

// Async Thunks for role CRUD operations

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/roles');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
  }
});

export const createRole = createAsyncThunk('roles/createRole', async (roleData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/roles/create', roleData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create role');
  }
});

export const updateRole = createAsyncThunk('roles/updateRole', async ({ roleId, roleData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/roles/update/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update role');
  }
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (roleId, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/roles/${roleId}`);
    return { id: roleId };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete role');
  }
});

// Slice for role state management
const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create role
      .addCase(createRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles.push(action.payload.role);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update role
      .addCase(updateRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((role) => role.id === action.payload.role.id);
        if (index !== -1) {
          state.roles[index] = action.payload.role;
        }
        state.status = 'succeeded';
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role.id !== action.payload.id);
        state.status = 'succeeded';
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;
