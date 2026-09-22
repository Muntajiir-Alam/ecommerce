import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

export const metadata = {
    title: 'My Products | Seller Dashboard',
    description: 'Manage your products',
};

export default function SellerProductsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Products</h1>
                <Link
                    href="/seller/products/new"
                    className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                    Add New Product
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {/* Seller's products */}
                <p className="text-gray-600 md:col-span-4">No products yet</p>
            </div>
        </div>
    );
}
