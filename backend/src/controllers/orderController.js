import orderModel from '../models/order.js';
import userModel from '../models/user.js';
import productModel from '../models/product.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import AppResponse from '../utils/appResponse.js';

const orderUser = catchAsync(async (req, res, next) => {
    const { items } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (!items || items.length === 0) {
        return next(new AppError('Order must contain at least one item', 400));
    }

    let totalAmountCalculated = 0;
    const orderItems = [];
    const stockUpdates = []; // Track for rollback if needed

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

        // Track stock reduction for potential rollback
        stockUpdates.push({ product, newStock: product.stock - quantity });

        // Reduce stock
        product.stock -= quantity;
        await product.save();

        totalAmountCalculated += product.price * quantity;

        orderItems.push({
            product: productId,
            quantity,
            price: product.price,
        });
    }

    try {
        const order = await orderModel.create({
            user: userId,
            items: orderItems,
            totalAmount: totalAmountCalculated,
            status: 'pending', // Always create as pending
        });

        return new AppResponse(201, 'Order created successfully', {
            order,
        }).send(res);
    } catch (error) {
        // Rollback stock changes on order creation failure
        for (const { product, newStock } of stockUpdates) {
            product.stock = newStock;
            await product.save();
        }
        throw error; // Re-throw for error handler
    }
});

const getOrders = catchAsync(async (req, res, next) => {
    const query = {};

    // Non-admin customers only see their own orders
    if (req.user.role !== 'admin') {
        query.user = req.user.id;
    }

    const orders = await orderModel
        .find(query)
        .select('items totalAmount status paymentStatus createdAt')
        .populate('items.product', 'name imagesUrls')
        .populate(
            req.user.role === 'admin'
                ? { path: 'user', select: 'username email' }
                : ''
        );

    return new AppResponse(200, 'Orders fetched successfully', { orders }).send(
        res
    );
});

const getOrderById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const order = await orderModel
        .findById(id)
        .select('items totalAmount status paymentStatus createdAt')
        .populate('user', 'username email')
        .populate('items.product', 'name imagesUrls');

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    // Ownership check: customer can only see their own orders
    if (
        order.user._id.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new AppError('You are not allowed to view this order', 403)
        );
    }

    return new AppResponse(200, 'Order fetched successfully', { order }).send(
        res
    );
});

const updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status, note } = req.body;

    const order = await orderModel
        .findById(req.params.id)
        .select('items totalAmount status paymentStatus createdAt')
        .populate('user', 'username email')
        .populate('items.product', 'name imagesUrls');

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    // Prevent illogical transitions
    const validTransitions = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['shipped', 'cancelled'],
        shipped: ['out_for_delivery'],
        out_for_delivery: ['delivered'],
        delivered: [],
        cancelled: [],
    };

    if (
        !validTransitions[order.status] ||
        !validTransitions[order.status].includes(status)
    ) {
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

    const order = await orderModel.findById(id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    // Ownership check: customer can only delete their own orders
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new AppError('You are not allowed to delete this order', 403)
        );
    }

    const result = await orderModel.findByIdAndDelete(id);

    return new AppResponse(200, 'Order deleted successfully').send(res);
});

const getOrderTracking = catchAsync(async (req, res, next) => {
    const order = await orderModel
        .findById(req.params.id)
        .select('status statusHistory user');

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

const requestReturn = catchAsync(async (req, res, next) => {
    const { reason } = req.body;
    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    if (order.user.toString() !== req.user.id) {
        return next(
            new AppError(
                'You are not allowed to request a return for this order',
                403
            )
        );
    }

    if (order.status !== 'delivered') {
        return next(new AppError('Only delivered orders can be returned', 400));
    }

    if (order.returnRequest.isRequested) {
        return next(
            new AppError('A return request already exists for this order', 409)
        );
    }

    // Find when it was delivered, from statusHistory
    const deliveredEntry = order.statusHistory.find(
        (entry) => entry.status === 'delivered'
    );
    const deliveredAt = deliveredEntry
        ? deliveredEntry.changedAt
        : order.updatedAt;

    const daysSinceDelivery =
        (Date.now() - new Date(deliveredAt)) / (1000 * 60 * 60 * 24);

    if (daysSinceDelivery > 7) {
        return next(
            new AppError(
                'Return window has expired (7 days from delivery)',
                400
            )
        );
    }

    order.returnRequest = {
        isRequested: true,
        reason,
        status: 'requested',
        requestedAt: new Date(),
    };

    await order.save();

    return new AppResponse(
        200,
        'Return request submitted successfully',
        order.returnRequest
    ).send(res);
});

const resolveReturnRequest = catchAsync(async (req, res, next) => {
    const { decision } = req.body; // 'approved' or 'rejected'

    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    if (order.returnRequest.status !== 'requested') {
        return next(
            new AppError('No pending return request for this order', 400)
        );
    }

    order.returnRequest.status = decision;
    order.returnRequest.resolvedAt = new Date();

    if (decision === 'approved') {
        order.status = 'return_approved'; // you'd need to add this to your status enum, or handle separately
    }

    await order.save();

    return new AppResponse(
        200,
        `Return request ${decision}`,
        order.returnRequest
    ).send(res);
});

export {
    orderUser,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getOrderTracking,
    requestReturn,
    resolveReturnRequest,
};
