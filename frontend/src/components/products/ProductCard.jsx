import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProductCard({ product = {} }) {
    const {
        id = 1,
        name = 'Sample Product',
        price = 29.99,
        image = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        category = 'General',
    } = product;

    return (
        <Card className="overflow-hidden">
            <div className="aspect-4/5 overflow-hidden bg-gray-100">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition hover:scale-105"
                />
            </div>
            <CardContent className="space-y-2 pt-4">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    {category}
                </p>
                <Link
                    href={`/products/${id}`}
                    className="block text-lg font-semibold hover:text-blue-600"
                >
                    {name}
                </Link>
                <p className="text-xl font-bold text-gray-900">
                    ${price.toFixed(2)}
                </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-3">
                <Button variant="outline" size="sm">
                    Wishlist
                </Button>
                <Button size="sm">Add to cart</Button>
            </CardFooter>
        </Card>
    );
}
