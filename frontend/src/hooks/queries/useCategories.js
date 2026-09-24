// src/hooks/queries/useCategories.js
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

// Fetch all active categories (public — used in filters, product forms, nav)
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000, // categories rarely change — cache for 5 min
    });
};

// Fetch a single category by ID
export const useCategoryById = (id) => {
    return useQuery({
        queryKey: ['categories', id],
        queryFn: async () => {
            const response = await api.get(`/categories/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
};

// Admin — create a category
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const response = await api.post('/categories', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

// Admin — update a category
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await api.patch(`/categories/${id}`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
        },
    });
};

// Admin — deactivate (soft delete) a category
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/categories/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};