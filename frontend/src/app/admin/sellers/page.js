export const metadata = {
    title: 'Sellers | Admin Dashboard',
    description: 'Approve pending seller registrations',
};

export default function AdminSellersPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Seller Approvals</h1>
            <div className="overflow-hidden rounded border bg-white">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                Store Name
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
                                colSpan="5"
                                className="px-6 py-4 text-center text-gray-600"
                            >
                                No pending sellers
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
