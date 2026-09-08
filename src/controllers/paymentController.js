import paymentModel from '../models/payment.js';
import orderModel from '../models/order.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import AppResponse from '../utils/appResponse.js';

export const initiatePayment = catchAsync(async (req, res, next) => {
    const { orderId, method } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    if (order.user.toString() !== req.user.id) {
        return next(new AppError('You are not allowed to pay for this order', 403));
    }

    if (order.paymentStatus === 'paid') {
        return next(new AppError('This order is already paid', 400));
    }

    // Simulate payment processing — randomly succeed/fail (90% success rate)
    const isSuccess = Math.random() < 0.9;

    const payment = await paymentModel.create({
        order: order._id,
        user: req.user.id,
        amount: order.totalAmount,
        method,
        status: isSuccess ? 'success' : 'failed',
    });

    if (isSuccess) {
        order.paymentStatus = 'paid';
        await order.save();
    }

    return new AppResponse(
        isSuccess ? 200 : 402,
        isSuccess ? 'Payment successful' : 'Payment failed, please try again',
        payment
    ).send(res);
});

export const getPaymentByOrder = catchAsync(async (req, res, next) => {
    const payment = await paymentModel.findOne({ order: req.params.orderId });

    if (!payment) {
        return next(new AppError('Payment not found for this order', 404));
    }

    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('You are not allowed to view this payment', 403));
    }

    return new AppResponse(200, 'Payment fetched successfully', payment).send(res);
});