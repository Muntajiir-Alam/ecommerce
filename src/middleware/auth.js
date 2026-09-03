import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import userModel from '../models/user.js';

const getToken = (req) => {
    const cookieToken = req.cookies?.token;
    const authorization =
        req.get?.('authorization') || req.headers?.authorization;

    if (cookieToken) {
        return cookieToken;
    }

    if (authorization?.startsWith('Bearer ')) {
        return authorization.slice('Bearer '.length);
    }

    return null;
};

const auth = catchAsync(async (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return next(new AppError('Unauthorized', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
