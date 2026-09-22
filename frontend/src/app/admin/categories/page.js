export const metadata = {
    title: 'Categories | Admin Dashboard',
    description: 'Manage product categories',
};

export default function AdminCategoriesPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Categories Management</h1>
            <div className="overflow-hidden rounded border bg-white">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                Products
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                            <td
                                colSpan="4"
                                className="px-6 py-4 text-center text-gray-600"
                            >
                                No categories found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
