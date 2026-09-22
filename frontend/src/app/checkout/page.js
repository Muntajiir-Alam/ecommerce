'use client';

export default function CheckoutPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <h2 className="mb-4 text-xl font-bold">Shipping Address</h2>
                    {/* Checkout form */}
                </div>
                <div>
                    <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
                    {/* Order summary */}
                </div>
            </div>
        </div>
    );
}
