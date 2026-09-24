// src/hooks/queries/useCart.js
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export const useCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await api.get('/cart');
            return response.data.data;
        },
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity }) => {
            const response = await api.post('/cart', { productId, quantity });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};