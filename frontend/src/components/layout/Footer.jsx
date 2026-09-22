import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t bg-gray-50">
            <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-4">
                <div>
                    <h3 className="mb-3 text-lg font-bold">E-Commerce</h3>
                    <p className="text-sm text-gray-600">
                        Your one-stop shop for modern essentials.
                    </p>
                </div>
                <div>
                    <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                        Shop
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                            <Link href="/products">All Products</Link>
                        </li>
                        <li>
                            <Link href="/products">New Arrivals</Link>
                        </li>
                        <li>
                            <Link href="/products">Best Sellers</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                        Account
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                            <Link href="/login">Login</Link>
                        </li>
                        <li>
                            <Link href="/register">Register</Link>
                        </li>
                        <li>
                            <Link href="/profile">Profile</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                        Support
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                            <Link href="/orders">Orders</Link>
                        </li>
                        <li>
                            <Link href="/checkout">Checkout</Link>
                        </li>
                        <li>
                            <Link href="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t bg-white px-4 py-4 text-center text-sm text-gray-500">
                © 2026 E-Commerce. All rights reserved.
            </div>
        </footer>
    );
}
