'use client';

import Link from 'next/link';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    {/* Cart items will be displayed here */}
                    <div className="rounded bg-gray-100 p-8 text-center">
                        <p className="text-gray-600">Your cart is empty</p>
                        <Link
                            href="/products"
                            className="mt-2 inline-block text-blue-600 hover:underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
                <div className="md:col-span-1">
                    <CartSummary />
                </div>
            </div>
        </div>
    );
}
