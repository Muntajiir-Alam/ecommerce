import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import userModel from '../models/user.js';

const auth = catchAsync(async (req, res, next) => {
    const token =
        req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return next(new AppError('Unauthorized', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (typeof decoded !== 'object' || !decoded.id) {
        return next(new AppError('Unauthorized', 401));
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
        return next(new AppError('Unauthorized', 401));
    }
    if (user.isDeleted) {
        return next(new AppError('User account is deleted', 403));
    }
    if (user.isBanned) {
        return next(new AppError('User account is banned', 403));
    }

    req.user = user;
    next();
});

export { auth };
