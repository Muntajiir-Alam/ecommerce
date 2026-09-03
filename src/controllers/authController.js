import userModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import tokenGen from '../helper/tokenGen.js';
import hashGen from '../helper/hashGen.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const getCurrentUser = catchAsync(async (req, res, next) => {
    if (!req.cookies?.token) {
        return next(new AppError('Unauthorized', 401));
    }

    const userId = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) {
                return next(new AppError('Unauthorized', 401));
            }
            return decoded.id;
        }
    );

    const user = await userModel.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    });
});

const registerUser = catchAsync(async (req, res, next) => {
    const { username, email, password, role = 'customer' } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
        return next(new AppError('User already exists', 409));
    }

    const hash = await hashGen(password);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role,
    });

    if (!user) {
        return next(new AppError('User registration failed', 500));
    }

    const token = tokenGen(user);

    res.cookie('token', token);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
});

const loginUser = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        return next(new AppError('Invalid credentials', 401));
    }

    if (user.isDeleted) {
        return next(new AppError('User account is deleted', 403));
    }
    if (user.isBanned) {
        return next(new AppError('User account is banned', 403));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return next(new AppError('Invalid credentials', 401));
    }

    const token = tokenGen(user);

    res.cookie('token', token);

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
});

const logoutUser = catchAsync(async (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out successfully' });
});

const resetPass = catchAsync(async (req, res, next) => {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: 'New and confirm password does not match',
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return next(new AppError('Invalid credentials', 401));
    }

    const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordValid) {
        return next(new AppError('Invalid credentials', 401));
    }

    user.password = await hashGen(newPassword);
    await user.save();

    const token = tokenGen(user);
    res.cookie('token', token);

    res.status(200).json({
        message: 'Reset password successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
});

export { getCurrentUser, registerUser, loginUser, logoutUser, resetPass };
