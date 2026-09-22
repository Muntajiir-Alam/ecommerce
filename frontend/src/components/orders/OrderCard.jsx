export default function OrderCard({
    order = { id: 'ORD-1001', total: 159.99, status: 'Processing' },
}) {
    return (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <h3 className="text-lg font-semibold">{order.id}</h3>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {order.status}
                </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-bold">${Number(order.total).toFixed(2)}</p>
            </div>
        </div>
    );
}
