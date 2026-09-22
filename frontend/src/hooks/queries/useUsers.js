import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await api.get('/users');
            return data;
        },
    });
}
