import ProductForm from '@/components/products/ProductForm';

export const metadata = {
    title: 'Add Product | Seller Dashboard',
    description: 'Add a new product',
};

export default function AddProductPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Add New Product</h1>
            <div className="max-w-2xl">
                <ProductForm />
            </div>
        </div>
    );
}
