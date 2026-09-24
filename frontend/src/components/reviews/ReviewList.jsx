'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function ReviewList({ productId }) {
    const { data: reviews, isLoading } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: async () => {
            const response = await api.get(`/reviews/product/${productId}`);
            return response.data.data;
        },
    });

    if (isLoading) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reviews</h2>
            {reviews?.length === 0 && <p className="text-gray-500">No reviews yet</p>}
            {reviews?.map((review) => (
                <div key={review._id} className="border-b pb-3">
                    <p className="font-medium">{review.user?.name}</p>
                    <p className="text-sm text-yellow-600">★ {review.rating}</p>
                    <p className="text-gray-700">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}