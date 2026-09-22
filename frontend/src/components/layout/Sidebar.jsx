import Link from 'next/link';

const defaultItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Sellers', href: '/admin/sellers' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Categories', href: '/admin/categories' },
    { label: 'Orders', href: '/admin/orders' },
];

export default function Sidebar({
    items = defaultItems,
    title = 'Navigation',
}) {
    return (
        <aside className="h-fit rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">{title}</h2>
            <nav className="space-y-2">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
