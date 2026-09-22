import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';

export const metadata = {
    title: 'Products | Ecommerce',
    description: 'Browse all products',
};

export default function ProductsPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Products</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <aside className="md:col-span-1">
                    <ProductFilters />
                </aside>
                <main className="md:col-span-3">
                    <ProductGrid />
                </main>
            </div>
        </div>
    );
}
