// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, // { id, username, email, role, ... }
    accessToken: null,
    isAuthenticated: false,
    isLoading: true, // true until silent refresh completes on app load
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setAuthLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setCredentials, clearCredentials, setAuthLoading } =
    authSlice.actions;
export default authSlice.reducer;
