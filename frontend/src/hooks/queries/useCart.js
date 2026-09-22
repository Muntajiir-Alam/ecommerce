import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useCart() {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const { data } = await api.get('/cart');
            return data;
        },
    });
}
