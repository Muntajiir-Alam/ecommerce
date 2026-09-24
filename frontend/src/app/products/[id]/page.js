// src/app/products/[id]/page.js
'use client';

import { useParams } from 'next/navigation';
import { useProductById } from '@/hooks/queries/useProducts';
import { useAddToCart } from '@/hooks/queries/useCart';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReviewList from '@/components/reviews/ReviewList';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { data: product, isLoading, error } = useProductById(id);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { mutate: addToCart, isPending: isAdding } = useAddToCart();

    if (isLoading) return <p className="p-8">Loading...</p>;
    if (error) return <p className="p-8 text-red-500">Product not found</p>;

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error('Please log in to add items to your cart');
            return;
        }

        addToCart(
            { productId: product._id, quantity: 1 },
            {
                onSuccess: () => toast.success('Added to cart'),
                onError: (err) =>
                    toast.error(err.response?.data?.message || 'Failed to add to cart'),
            }
        );
    };

    return (
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                {product.imagesUrls?.[0] ? (
                    <img
                        src={product.imagesUrls[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        No image
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-sm text-gray-500">{product.category?.name}</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold">₹{product.price}</span>
                    {product.averageRating > 0 && (
                        <Badge variant="secondary">
                            ★ {product.averageRating} ({product.numReviews})
                        </Badge>
                    )}
                </div>

                <p className="text-gray-700">{product.description}</p>

                <p className="text-sm text-gray-500">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>

                <Button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stock === 0}
                    className="w-full sm:w-auto"
                >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                </Button>
            </div>

            <div className="md:col-span-2">
                <ReviewList productId={product._id} />
            </div>
        </div>
    );
}