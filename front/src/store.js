// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import usersReducer from './features/users/userSlice';
import roleReducer from './features/role/roleSlice';
import permissionReducer from './features/permission/permissionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    roles: roleReducer,
    permissions: permissionReducer,
  },
});
