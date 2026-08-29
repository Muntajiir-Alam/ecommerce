import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import orderModel from '../models/order.js';
import userModel from '../models/user.js';

async function orderUser(req, res) {
    
    const { userId, items, totalAmount, status } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!items || items.length === 0) {
        return res
            .status(400)
            .json({ message: 'Order must contain at least one item' });
    }

    let totalAmountCalculated = 0;
    const orderItems = [];

    for (const item of items) {
        const { productId, quantity } = item;

        const product = await productModel.findById(productId);

        if (!product) {
            return res
                .status(404)
                .json({ message: `Product with ID ${productId} not found` });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                message: `Insufficient stock for product ${product.name}`,
            });
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
        return res.status(400).json({
            message: 'Total amount does not match calculated total',
        });
    }

    const order = await orderModel.create({
        user: userId,
        items: orderItems,
        totalAmount,
        status,
    });

    res.status(201).json({ message: 'Order created successfully', order });
}

async function getOrders(req, res) {
    const orders = await orderModel
        .find()
        .populate('user')
        .populate('items.productId');

    res.status(200).json({ orders });
}

async function getOrderById(req, res) {
    const { id } = req.params;

    const order = await orderModel
        .findById(id)
        .populate('user')
        .populate('items.productId');

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
}

async function updateOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
        message: 'Order status updated successfully',
        order,
    });
}

async function deleteOrder(req, res) {
    const { id } = req.params;

    const order = await orderModel.findByIdAndDelete(id);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
}

export { orderUser, getOrders, getOrderById, updateOrderStatus, deleteOrder };
