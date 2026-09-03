import orderModel from '../models/order.js';
import userModel from '../models/user.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const listUsers = catchAsync(async (req, res, next) => {
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
});

const viewUserDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id).select('-password');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        success: true,
        data: user,
    });
});

const updateUserRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = await userModel
        .findByIdAndUpdate(id, { role }, { returnDocument: 'after' })
        .select('-password');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        success: true,
        data: user,
    });
});

const banUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel
        .findByIdAndUpdate(id, { isBanned: true }, { returnDocument: 'after' })
        .select('-password');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ message: `Banned user ID: ${id}`, data: user });
});

const unbanUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel
        .findByIdAndUpdate(id, { isBanned: false }, { returnDocument: 'after' })
        .select('-password');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ message: `Unbanned user ID: ${id}`, data: user });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel
        .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
        .select('-password');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ message: `Deleted user ID: ${id}`, data: user });
});

const restoreDeletedUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel
        .findByIdAndUpdate(id, { isDeleted: false }, { new: true })
        .select('-password');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ message: `Restored user ID: ${id}`, data: user });
});

const viewUserOrders = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const orders = await orderModel.find({ user: id });
    if (!orders || orders.length === 0) {
        return next(new AppError('Orders not found', 404));
    }
    res.status(200).json({
        message: `View order history for user ID: ${id}`,
        data: orders,
    });
});

export {
    listUsers,
    viewUserDetails,
    updateUserRole,
    banUser,
    unbanUser,
    deleteUser,
    viewUserOrders,
    restoreDeletedUser,
};
