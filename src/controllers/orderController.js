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
    
    return new AppResponse(201, 'Order created successfully', { order }).send(res);
});

const getOrders = catchAsync(async (req, res, next) => {
    const orders = await orderModel
        .find()
        .populate('user')
        .populate('items.productId');

    return new AppResponse(200, 'Orders fetched successfully', { orders }).send(res);
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

    return new AppResponse(200, 'Order fetched successfully', { order }).send(res);
});

const updateOrderStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    return new AppResponse(200, 'Order status updated successfully', { order }).send(res);
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const order = await orderModel.findByIdAndDelete(id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    return new AppResponse(200, 'Order deleted successfully', null).send(res);
});

export { orderUser, getOrders, getOrderById, updateOrderStatus, deleteOrder };
