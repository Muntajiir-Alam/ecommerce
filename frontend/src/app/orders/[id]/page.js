'use client';

import { useParams } from 'next/navigation';
import OrderTimeline from '@/components/orders/OrderTimeline';

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id;

    // TODO: Fetch order details based on orderId

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Order Details</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    {/* Order information */}
                    <div className="mb-6 rounded border bg-white p-6">
                        <h2 className="mb-4 text-xl font-bold">
                            Order #{orderId}
                        </h2>
                        {/* Order items */}
                    </div>
                    <OrderTimeline orderId={orderId} />
                </div>
                <div>
                    {/* Order summary sidebar */}
                    <div className="rounded bg-gray-50 p-6">
                        <h3 className="mb-4 font-bold">Summary</h3>
                        <p className="text-gray-600">
                            Order details will appear here
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
