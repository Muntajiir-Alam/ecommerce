import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        method: {
            type: String,
            enum: ['card', 'upi', 'cod'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed'],
            default: 'pending',
        },
        transactionId: {
            type: String,
            default: () => `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
        },
    },
    { timestamps: true }
);
const paymentModel = mongoose.model('Payment', paymentSchema);
export default paymentModel;