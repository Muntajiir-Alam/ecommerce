const timeline = [
    { title: 'Order Placed', date: 'Today' },
    { title: 'Packed', date: 'Tomorrow' },
    { title: 'Shipped', date: 'In transit' },
    { title: 'Delivered', date: 'Expected soon' },
];

export default function OrderTimeline({ orderId }) {
    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold">Order Timeline</h3>
            <div className="space-y-4">
                {timeline.map((step, index) => (
                    <div key={step.title} className="flex items-center gap-4">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                index === 0
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {index + 1}
                        </div>
                        <div>
                            <p className="font-medium">{step.title}</p>
                            <p className="text-sm text-gray-500">{step.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
