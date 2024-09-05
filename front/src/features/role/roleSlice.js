import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; // Ensure Axios instance is configured with baseURL

// Fetch all roles with authorization
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get('/api/roles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
  }
);

// Create a new role with authorization
export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post('/api/roles/create', roleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.role;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create role');
    }
  }
);

// Update an existing role with authorization
export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ roleId, roleData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.put(`/api/roles/update/${roleId}`, roleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.role; // Assuming the updated role object is in the `role` key
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
  }
);

// Delete a role with authorization
export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (roleId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`/api/roles/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return roleId; // Returning the deleted role ID to remove it from the Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete role');
    }
  }
);

// Role Slice
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
      // Handle fetch roles
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

      // Handle create role
      .addCase(createRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handle update role
      .addCase(updateRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((role) => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload; // Update the role in the state
        }
        state.status = 'succeeded';
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handle delete role
      .addCase(deleteRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role._id !== action.payload); // Remove deleted role
        state.status = 'succeeded';
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;
