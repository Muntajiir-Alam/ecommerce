'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({
    children,
    allowedRoles = [],
    requireAuth = true,
}) {
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (
            allowedRoles.length > 0 &&
            (!user || !allowedRoles.includes(user.role))
        ) {
            router.push('/');
        }
    }, [isAuthenticated, requireAuth, allowedRoles, user, router]);

    if (requireAuth && !isAuthenticated) {
        return null;
    }

    if (
        allowedRoles.length > 0 &&
        (!user || !allowedRoles.includes(user.role))
    ) {
        return null;
    }

    return children;
}
