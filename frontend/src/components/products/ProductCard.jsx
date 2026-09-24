import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProductCard({ product }) {
    return (
        <Link href={`/products/${product._id}`}>
            <Card className="h-full transition hover:shadow-md">
                <CardContent className="p-4">
                    <div className="mb-3 aspect-square overflow-hidden rounded-md bg-gray-100">
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
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                        {product.category?.name}
                    </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <span className="font-semibold">₹{product.price}</span>
                    {product.averageRating > 0 && (
                        <Badge variant="secondary">★ {product.averageRating}</Badge>
                    )}
                </CardFooter>
            </Card>
        </Link>
    );
}