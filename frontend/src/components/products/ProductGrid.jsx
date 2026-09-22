import ProductCard from '@/components/products/ProductCard';

const sampleProducts = [
    {
        id: 1,
        name: 'Classic Leather Backpack',
        price: 69.99,
        category: 'Accessories',
    },
    {
        id: 2,
        name: 'Wireless Noise Cancelling Headphones',
        price: 149.99,
        category: 'Electronics',
    },
    { id: 3, name: 'Minimalist Desk Lamp', price: 39.99, category: 'Home' },
    {
        id: 4,
        name: 'Premium Cotton T-Shirt',
        price: 24.99,
        category: 'Apparel',
    },
];

export default function ProductGrid({
    products = sampleProducts,
    type = 'catalog',
}) {
    if (type === 'wishlist' && products.length === 0) {
        return (
            <p className="text-gray-500 md:col-span-4">
                No wishlist items yet.
            </p>
        );
    }

    return (
        <>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </>
    );
}
