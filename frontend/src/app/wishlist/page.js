import ProductGrid from '@/components/products/ProductGrid';

export const metadata = {
    title: 'Wishlist | Ecommerce',
    description: 'Your wishlist',
};

export default function WishlistPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Wishlist</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <ProductGrid type="wishlist" />
            </div>
        </div>
    );
}
