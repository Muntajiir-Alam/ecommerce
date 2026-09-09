import orderModel from '../models/order.js';
import userModel from '../models/user.js';
import AppError from '../utils/appError.js';
import AppResponse from '../utils/appResponse.js';
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
        .select('username email role isBanned isDeleted createdAt')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const totalUsers = await userModel.countDocuments(filter);
    return new AppResponse(200, 'Users fetched successfully', {
        users,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
        },
    }).send(res);
});

const viewUserDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel
        .findById(id)
        .select('username email role isBanned isDeleted createdAt');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    return new AppResponse(200, 'User details fetched successfully', {
        user,
    }).send(res);
});

const updateUserRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = await userModel
        .findByIdAndUpdate(id, { role }, { returnDocument: 'after' })
        .select('username email role isBanned isDeleted createdAt');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    return new AppResponse(200, 'User role updated successfully', {
        user,
    }).send(res);
});

const banUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel
        .findByIdAndUpdate(id, { isBanned: true }, { returnDocument: 'after' })
        .select('username email role isBanned isDeleted createdAt');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    return new AppResponse(200, 'User banned successfully', { user }).send(res);
});

const unbanUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel
        .findByIdAndUpdate(id, { isBanned: false }, { returnDocument: 'after' })
        .select('username email role isBanned isDeleted createdAt');

    if (!user) {
        return next(new AppError('User not found', 404));
    }
    return new AppResponse(200, 'User unbanned successfully', { user }).send(
        res
    );
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel
        .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
        .select('username email role isBanned isDeleted createdAt');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    return new AppResponse(200, 'User deleted successfully', { user }).send(
        res
    );
});

const restoreDeletedUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel
        .findByIdAndUpdate(id, { isDeleted: false }, { new: true })
        .select('username email role isBanned isDeleted createdAt');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    return new AppResponse(200, 'User restored successfully', { user }).send(
        res
    );
});

const viewUserOrders = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const orders = await orderModel
        .find({ user: id })
        .select('items totalAmount status paymentStatus createdAt')
        .populate('user', 'username email')
        .populate('items.product', 'name imagesUrls');
    if (!orders || orders.length === 0) {
        return next(new AppError('Orders not found', 404));
    }
    return new AppResponse(200, 'User orders fetched successfully', {
        orders,
    }).send(res);
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
