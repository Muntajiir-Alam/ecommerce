export default function ReviewList({ productId }) {
    const reviews = [
        {
            id: 1,
            author: 'Alice',
            rating: 5,
            comment: 'Excellent quality and fast shipping.',
        },
        {
            id: 2,
            author: 'Sam',
            rating: 4,
            comment: 'Looks great and works as expected.',
        },
    ];

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="rounded-lg border bg-white p-4 shadow-sm"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold">{review.author}</h4>
                        <span className="text-yellow-500">
                            {'★'.repeat(review.rating)}
                        </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}
