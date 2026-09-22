import OrderCard from '@/components/orders/OrderCard';

export const metadata = {
    title: 'Orders | Seller Dashboard',
    description: 'View seller orders',
};

export default function SellerOrdersPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Orders</h1>
            <div className="space-y-4">
                {/* Orders containing seller's products */}
                <p className="text-gray-600">No orders yet</p>
            </div>
        </div>
    );
}
