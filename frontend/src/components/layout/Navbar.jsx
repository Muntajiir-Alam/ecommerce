// src/components/layout/Navbar.jsx
'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useCart } from '@/hooks/queries/useCart';
import { useLogout } from '@/hooks/queries/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const { data: cart } = useCart();
    const { mutate: logout } = useLogout();

    const cartItemCount = cart?.items?.length || 0;

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                toast.success('Logged out successfully');
                router.push('/');
            },
        });
    };

    return (
        <nav className="border-b bg-white">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="text-xl font-bold">
                    ShopEase
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/products" className="text-sm hover:underline">
                        Products
                    </Link>

                    {isAuthenticated && (
                        <Link href="/cart" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {isLoading ? null : isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/orders">My Orders</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/wishlist">Wishlist</Link>
                                </DropdownMenuItem>

                                {user?.role === 'seller' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/seller/dashboard">Seller Dashboard</Link>
                                    </DropdownMenuItem>
                                )}

                                {user?.role === 'admin' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/dashboard">Admin Dashboard</Link>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem onClick={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Sign up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}