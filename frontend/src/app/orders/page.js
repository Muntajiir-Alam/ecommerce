import OrderCard from '@/components/orders/OrderCard';

export const metadata = {
    title: 'Orders | Ecommerce',
    description: 'View your orders',
};

export default function OrdersPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">My Orders</h1>
            <div className="space-y-4">
                {/* Orders will be listed here */}
                <p className="text-gray-600">No orders yet</p>
            </div>
        </div>
    );
}
