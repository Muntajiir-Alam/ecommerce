'use client';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

export function useAuth() {
    const dispatch = useDispatch();
    const { user, isAuthenticated, token } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return {
        user,
        token,
        isAuthenticated,
        logout: handleLogout,
    };
}
