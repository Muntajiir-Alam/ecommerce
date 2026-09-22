'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken, user } = response.data.data;
                dispatch(setCredentials({ user, accessToken }));
            } catch (error) {
                dispatch(clearCredentials());
            }
        };

        initAuth();
    }, [dispatch]);

    return children;
}