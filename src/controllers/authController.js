import userModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import {
    generateRefreshToken,
    generateAccessToken,
} from '../helper/genrateTokens.js';
import hashGen from '../helper/hashGen.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const getCurrentUser = catchAsync(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        return next(new AppError('Unauthorized', 401));
    }

    let decoded;
    try {
        decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
        return next(new AppError('Unauthorized', 401));
    }

    const user = await userModel.findById(decoded.id);
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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY),
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY),
    });

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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return next(new AppError('Invalid credentials', 401));
    }

    if (user.isDeleted) {
        return next(new AppError('User account is deleted', 403));
    }
    if (user.isBanned) {
        return next(new AppError('User account is banned', 403));
    }

    const accessToken = generateAccessToken(user);
    if (!accessToken) {
        return next(new AppError('Failed to generate access token', 500));
    }
    const refreshToken = generateRefreshToken(user);
    if (!refreshToken) {
        return next(new AppError('Failed to generate refresh token', 500));
    }

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY),
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY),
    });

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
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY),
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY),
    });

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

const refreshToken = catchAsync(async (req, res, next) => {
    const refreshTokenFromCookie = req.cookies?.refreshToken;

    if (!refreshTokenFromCookie) {
        return next(new AppError('Unauthorized', 401));
    }

    let decoded;
    try {
        decoded = jwt.verify(
            refreshTokenFromCookie,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (err) {
        return next(new AppError('Unauthorized', 401));
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY),
    });

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY),
    });

    res.status(200).json({
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
});

export {
    getCurrentUser,
    registerUser,
    loginUser,
    logoutUser,
    resetPass,
    refreshToken,
};
