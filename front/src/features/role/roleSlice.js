import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; // Assuming axios instance is set up

// Fetch all roles
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/roles');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
  }
});

// Create a role
export const createRole = createAsyncThunk('roles/createRole', async (roleData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/roles/create', roleData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create role');
  }
});

// Update a role
export const updateRole = createAsyncThunk('roles/updateRole', async ({ roleId, roleData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/roles/update/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update role');
  }
});

// Delete a role
export const deleteRole = createAsyncThunk('roles/deleteRole', async (roleId, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/roles/${roleId}`);
    return roleId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete role');
  }
});

// Role slice
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
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload.role); // Add the new role
      })

      // Update role
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex(r => r._id === action.payload.role._id);
        if (index !== -1) {
          state.roles[index] = action.payload.role;
        }
      })

      // Delete role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter(r => r._id !== action.payload);
      });
  },
});

export default roleSlice.reducer;
