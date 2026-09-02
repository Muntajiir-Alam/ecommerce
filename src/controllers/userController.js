import userModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import tokenGen from '../helper/tokenGen.js';
import hashGen from '../helper/hashGen.js';
import jwt from 'jsonwebtoken';

async function listUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.role) {
        filter.role = req.query.role;
    }

    if (req.query.search) {
        filter.$or = [
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ];
    }

    const users = await userModel
        .find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const totalUsers = await userModel.countDocuments(filter);

    res.status(200).json({
        success: true,
        data: users,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
        },
    });
}

async function viewUserDetails(req, res) {
    const { id } = req.params;
    const user = await userModel.findById(id).select('-password');
    res.status(200).json({
        success: true,
        data: user,
    });
}

async function updateUserRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;
    // Implement logic to update a user's role
    res.status(200).json({
        message: `Update role for user ID: ${id} to ${role}`,
    });
}

async function banUser(req, res) {
    const { id } = req.params;
    // Implement logic to ban/suspend a user
    res.status(200).json({ message: `Ban/suspend user ID: ${id}` });
}

async function deleteUser(req, res) {
    const { id } = req.params;
    // Implement logic to soft delete a user
    res.status(200).json({ message: `Delete (soft delete) user ID: ${id}` });
}

async function viewUserOrders(req, res) {
    const { id } = req.params;
    // Implement logic to view a specific user's order history
    res.status(200).json({ message: `View order history for user ID: ${id}` });
}

export {
    listUsers,
    viewUserDetails,
    updateUserRole,
    banUser,
    deleteUser,
    viewUserOrders,
};
