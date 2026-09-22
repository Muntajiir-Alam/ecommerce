'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ReviewForm({ productId }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Review submit', { productId, rating, comment });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border bg-white p-5 shadow-sm"
        >
            <h3 className="text-lg font-semibold">Write a review</h3>

            <div className="space-y-2">
                <Label>Rating</Label>
                <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm outline-none"
                    placeholder="Share your experience"
                />
            </div>

            <Button type="submit" className="w-full">
                Submit Review
            </Button>
        </form>
    );
}
