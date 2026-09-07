import mongoose from 'mongoose';

import orderModel from '../models/order.js';
import userModel from '../models/user.js';
import productModel from '../models/product.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import AppResponse from '../utils/appResponse.js';
import cartModel from '../models/cart.js';

/*
GET    /cart              → view own cart
POST   /cart               → add item to cart
PATCH  /cart/:productId    → update quantity of an item
DELETE /cart/:productId    → remove an item
DELETE /cart                → clear entire cart

*/

const getCart = catchAsync(async (req, res, next) => {
    const cart = await cartModel
        .findOne({ user: req.user.id })
        .populate('items.product');

    if (!cart) {
        return new AppResponse(200, 'Cart is empty', { items: [] }).send(res);
    }

    return new AppResponse(200, 'Cart fetched successfully', cart).send(res);
});

const addToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    let cart = await cartModel.findOne({ user: req.user.id });

    if (!cart) {
        cart = await cartModel.create({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity += quantity; // already in cart, just increase quantity
    } else {
        cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    return new AppResponse(200, 'Item added to cart', cart).send(res);
});

const updateCartItem = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findOne({ user: req.user.id });

    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
        return next(new AppError('Item not found in cart', 404));
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return new AppResponse(200, 'Cart item updated', cart).send(res);
});

const removeCartItem = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    const cart = await cartModel.findOne({ user: req.user.id });

    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
        return next(new AppError('Item not found in cart', 404));
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return new AppResponse(200, 'Cart item removed', cart).send(res);
});

const clearCart = catchAsync(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user.id });

    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    cart.items = [];
    await cart.save();

    return new AppResponse(200, 'Cart cleared', cart).send(res);
});

const checkout = catchAsync(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
        return next(new AppError('Cart is empty', 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let totalAmount = 0;
        const orderItems = [];

        for (const cartItem of cart.items) {
            const updatedProduct = await productModel.findOneAndUpdate(
                { _id: cartItem.product, stock: { $gte: cartItem.quantity } },
                { $inc: { stock: -cartItem.quantity } },
                { new: true, session }
            );

            if (!updatedProduct) {
                throw new AppError(
                    `Insufficient stock or invalid product: ${cartItem.product}`,
                    400
                );
            }

            const itemTotal = updatedProduct.price * cartItem.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: updatedProduct._id,
                quantity: cartItem.quantity,
                price: updatedProduct.price,
            });
        }

        const order = await orderModel.create(
            [
                {
                    user: req.user.id,
                    items: orderItems,
                    totalAmount,
                    status: 'pending',
                },
            ],
            { session }
        );

        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();

        return new AppResponse(201, 'Order placed successfully', order[0]).send(res);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return next(error);
    }
});

export {
    addToCart,
    getCart,
    checkout,
    updateCartItem,
    removeCartItem,
    clearCart,
};
