import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
    if (!products || products.length === 0) {
        return <p className="text-center text-gray-500 py-12">No products found</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}