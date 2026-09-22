'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, UserCircle2, Search } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Navbar() {
    const { totalItems } = useSelector((state) => state.cart);

    return (
        <header className="border-b bg-white/90 backdrop-blur">
            <nav className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    E-Commerce
                </Link>

                <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Home
                    </Link>
                    <Link
                        href="/products"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Shop
                    </Link>
                    <Link
                        href="/categories"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Categories
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-full border bg-gray-50 px-3 py-2 md:flex">
                        <Search className="h-4 w-4 text-gray-500" />
                        <input
                            aria-label="Search products"
                            placeholder="Search"
                            className="w-32 border-0 bg-transparent text-sm outline-none"
                        />
                    </div>

                    <Link
                        href="/wishlist"
                        className="relative p-2 text-gray-700 hover:text-gray-900"
                    >
                        <Heart className="h-5 w-5" />
                    </Link>

                    <Link
                        href="/cart"
                        className="relative p-2 text-gray-700 hover:text-gray-900"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/profile"
                        className="p-2 text-gray-700 hover:text-gray-900"
                    >
                        <UserCircle2 className="h-5 w-5" />
                    </Link>

                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Login
                    </Link>
                </div>
            </nav>
        </header>
    );
}
