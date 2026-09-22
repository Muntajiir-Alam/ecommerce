import { Button } from '@/components/ui/button';

export default function CartSummary() {
    const subtotal = 0;
    const shipping = 0;
    const total = subtotal + shipping;

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            <Button className="mt-5 w-full">Proceed to Checkout</Button>
        </div>
    );
}
