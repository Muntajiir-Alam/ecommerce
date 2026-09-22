export const ROLES = {
    ADMIN: 'admin',
    SELLER: 'seller',
    CUSTOMER: 'customer',
};

export const ROLE_ACCESS = {
    admin: [
        '/admin',
        '/admin/dashboard',
        '/admin/users',
        '/admin/sellers',
        '/admin/products',
        '/admin/categories',
        '/admin/orders',
    ],
    seller: [
        '/seller',
        '/seller/dashboard',
        '/seller/products',
        '/seller/orders',
    ],
    customer: ['/profile', '/orders', '/cart', '/checkout', '/wishlist'],
};
