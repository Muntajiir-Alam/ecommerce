import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import orderModel from '../models/order.js';

async function orderUser(req, res) {

    /*
    input: {
        userId: String,
        items: [
            {
                productId: String,
                quantity: Number
            }
        ],
        totalAmount: Number,
        status: String
    }
    */

    const { userId, items , totalAmount, status} = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const order = await orderModel.create({
        user: userId,
        items,
        totalAmount,
        status
    });

    res.status(201).json({ message: 'Order created successfully', order });
}

async function getOrders(req, res) {
    const orders = await orderModel.find().populate('user').populate('items.product');

    res.status(200).json({ orders });
}

async function getOrderById(req, res) {
    const { id } = req.params;

    const order = await orderModel.findById(id).populate('user').populate('items.product');

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

    res.status(200).json({ message: 'Order status updated successfully', order });
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
