import orderModel from '../models/order.js';
import userModel from '../models/user.js';
import productModel from '../models/product.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import AppResponse from '../utils/appResponse.js';

const orderUser = catchAsync(async (req, res, next) => {
    const { userId, items, totalAmount, status } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (!items || items.length === 0) {
        return next(new AppError('Order must contain at least one item', 400));
    }

    let totalAmountCalculated = 0;
    const orderItems = [];

    for (const item of items) {
        const { productId, quantity } = item;

        const product = await productModel.findById(productId);

        if (!product) {
            return next(
                new AppError(`Product with ID ${productId} not found`, 404)
            );
        }

        if (product.stock < quantity) {
            return next(
                new AppError(
                    `Insufficient stock for product ${product.name}`,
                    400
                )
            );
        }

        // Reduce stock
        product.stock -= quantity;
        await product.save();

        totalAmountCalculated += product.price * quantity;

        orderItems.push({
            productId,
            quantity,
            price: product.price,
        });
    }

    if (totalAmountCalculated !== totalAmount) {
        return next(
            new AppError('Total amount does not match calculated total', 400)
        );
    }

    const order = await orderModel.create({
        user: userId,
        items: orderItems,
        totalAmount,
        status,
    });

    return new AppResponse(201, 'Order created successfully', { order }).send(
        res
    );
});

const getOrders = catchAsync(async (req, res, next) => {
    const orders = await orderModel
        .find()
        .populate('user')
        .populate('items.productId');

    return new AppResponse(200, 'Orders fetched successfully', { orders }).send(
        res
    );
});

const getOrderById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const order = await orderModel
        .findById(id)
        .populate('user')
        .populate('items.productId');

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    return new AppResponse(200, 'Order fetched successfully', { order }).send(
        res
    );
});

const updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status, note } = req.body;

    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    // prevent illogical transitions (optional but good practice)
    const validTransitions = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['shipped', 'cancelled'],
        shipped: ['out_for_delivery'],
        out_for_delivery: ['delivered'],
        delivered: [],
        cancelled: [],
    };

    if (!validTransitions[order.status].includes(status)) {
        return next(
            new AppError(
                `Cannot change status from ${order.status} to ${status}`,
                400
            )
        );
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || '' });
    await order.save();

    return new AppResponse(
        200,
        'Order status updated successfully',
        order
    ).send(res);
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const order = await orderModel.findByIdAndDelete(id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    return new AppResponse(200, 'Order deleted successfully', null).send(res);
});

const getOrderTracking = catchAsync(async (req, res, next) => {
    const order = await orderModel
        .findById(req.params.id)
        .select('status statusHistory');

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new AppError('You are not allowed to view this order', 403)
        );
    }

    return new AppResponse(200, 'Order tracking fetched successfully', {
        currentStatus: order.status,
        timeline: order.statusHistory,
    }).send(res);
});

export {
    orderUser,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getOrderTracking,
};
