'use client';

import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import api from '@/lib/axios';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';

export const useLogin = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            const { accessToken, ...user } = data.data;
            dispatch(setCredentials({ user, accessToken }));
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (userData) => {
            const response = await api.post('/auth/register', userData);
            return response.data;
        },
    });
};

export const useLogout = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: async () => {
            await api.post('/auth/logout');
        },
        onSuccess: () => {
            dispatch(clearCredentials());
        },
    });
};