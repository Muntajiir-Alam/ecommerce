'use client';

export default function SellerDashboardPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Seller Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {/* Dashboard statistics cards */}
                <div className="rounded border bg-white p-6">
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold">$0</p>
                </div>
                <div className="rounded border bg-white p-6">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold">0</p>
                </div>
                <div className="rounded border bg-white p-6">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">0</p>
                </div>
                <div className="rounded border bg-white p-6">
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl font-bold">0.0</p>
                </div>
            </div>
        </div>
    );
}
