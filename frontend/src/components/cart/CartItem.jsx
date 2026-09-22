export default function CartItem({
    item = { name: 'Cart Item', price: 29.99, quantity: 1 },
}) {
    return (
        <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
                <p className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                    type="button"
                    className="text-sm text-red-500 hover:underline"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}
