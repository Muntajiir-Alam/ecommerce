import ProductForm from '@/components/products/ProductForm';

export const metadata = {
    title: 'Edit Product | Seller Dashboard',
    description: 'Edit product details',
};

export default function EditProductPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Edit Product</h1>
            <div className="max-w-2xl">
                <ProductForm isEdit={true} />
            </div>
        </div>
    );
}
