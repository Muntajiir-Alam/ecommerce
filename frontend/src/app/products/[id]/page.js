'use client';

import { useParams } from 'next/navigation';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id;

    // TODO: Fetch product details based on productId

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    {/* Product Image */}
                    <div className="flex h-96 items-center justify-center rounded bg-gray-200">
                        <p className="text-gray-500">Product Image</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {/* Product Details */}
                    <h1 className="text-3xl font-bold">Product Name</h1>
                    <p className="text-xl text-gray-600">Price</p>
                    <p className="text-gray-700">
                        Product description goes here
                    </p>
                    <button className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="mb-6 text-2xl font-bold">Reviews</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <ReviewList productId={productId} />
                    </div>
                    <div>
                        <ReviewForm productId={productId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
