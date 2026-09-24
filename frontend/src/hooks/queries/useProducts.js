'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

// Fetch all products (public, supports pagination/filters later)
export const useProducts = (params = {}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const response = await api.get('/products', { params });
            return response.data.data;
        },
    });
};

// Fetch a single product by ID
export const useProductById = (id) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const response = await api.get(`/products/${id}`);
            return response.data.data;
        },
        enabled: !!id, // don't run the query until an id actually exists
    });
};

// Seller/Admin — create a product
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            const response = await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

// Seller/Admin — update a product
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await api.patch(`/products/${id}`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
        },
    });
};

// Seller/Admin — delete a product
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

// Seller — view own products
export const useMyProducts = () => {
    return useQuery({
        queryKey: ['products', 'my-products'],
        queryFn: async () => {
            const response = await api.get('/products/my-products');
            return response.data.data;
        },
    });
};