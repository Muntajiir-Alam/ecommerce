import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'paid', 'refunded'],
            default: 'unpaid',
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                },
                note: {
                    type: String,
                    default: '',
                },
            },
        ],
    },
    { timestamps: true }
);

const orderModel = mongoose.model('Order', orderSchema);
export default orderModel;
