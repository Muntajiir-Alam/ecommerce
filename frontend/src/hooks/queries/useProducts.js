import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useProducts(params = {}) {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const { data } = await api.get('/products', { params });
            return data;
        },
    });
}
