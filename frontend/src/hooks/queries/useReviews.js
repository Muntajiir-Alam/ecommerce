import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useReviews(productId) {
    return useQuery({
        queryKey: ['reviews', productId],
        queryFn: async () => {
            const { data } = await api.get(`/products/${productId}/reviews`);
            return data;
        },
        enabled: Boolean(productId),
    });
}
