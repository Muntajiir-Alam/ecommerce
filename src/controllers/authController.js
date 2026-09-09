import userModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import {
    generateRefreshToken,
    generateAccessToken,
} from '../helper/generateTokens.js';
import hashGen from '../helper/hashGen.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import logger from '../utils/logger.js';
import AppResponse from '../utils/appResponse.js';
import { log } from 'console';

const getCurrentUser = catchAsync(async (req, res, next) => {
    logger.info('Fetching current user information');

    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        logger.warn('Access token not found in cookies');
        return next(new AppError('Unauthorized', 401));
    }

    let decoded;
    try {
        decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
        logger.warn('Invalid access token');
        return next(new AppError('Unauthorized', 401));
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
        logger.warn('User not found');
        return next(new AppError('User not found', 404));
    }
    return new AppResponse(200, 'Current user fetched successfully', {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    }).send(res);
});

const registerUser = catchAsync(async (req, res, next) => {
    logger.info('Registering new user');
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
        logger.warn('User already exists');
        return next(new AppError('User already exists', 409));
    }

    const hash = await hashGen(password);

    const user = await userModel.create({
        username,
        email,
        password: hash,
    });

    if (!user) {
        logger.error('Failed to create user');
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

    return new AppResponse(201, 'User registered successfully', {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    }).send(res);
});

const loginUser = catchAsync(async (req, res, next) => {
    logger.info('Logging in user');
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [{ username }, { email }],
    });
    if (!user) {
        logger.warn('User not found');
        return next(new AppError('Invalid credentials', 401));
    }

    if (user.isDeleted) {
        logger.warn('User account is deleted');
        return next(new AppError('User account is deleted', 403));
    }

    if (user.isBanned) {
        logger.warn('User account is banned');
        return next(new AppError('User account is banned', 403));
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
        const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
        return next(
            new AppError(
                `Account locked. Try again in ${minutesLeft} minutes`,
                403
            )
        );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= 5) {
            user.lockUntil = Date.now() + 15 * 60 * 1000;
            user.failedLoginAttempts = 0;
        }

        await user.save();
        logger.warn('Invalid credentials');
        return next(new AppError('Invalid credentials', 401));
    }

    const accessToken = generateAccessToken(user);
    if (!accessToken) {
        logger.error('Failed to generate access token');
        return next(new AppError('Failed to generate access token', 500));
    }

    const refreshToken = generateRefreshToken(user);
    if (!refreshToken) {
        logger.error('Failed to generate refresh token');
        return next(new AppError('Failed to generate refresh token', 500));
    }

    user.refreshToken = refreshToken;
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
    });

    return new AppResponse(200, 'User logged in successfully', {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken,
    }).send(res);
});

const logoutUser = catchAsync(async (req, res, next) => {
    logger.info('Logging out user');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return new AppResponse(200, 'User logged out successfully').send(res);
});

const resetPass = catchAsync(async (req, res, next) => {
    logger.info('Resetting user password');
    const { email, currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        logger.warn('New and confirm password do not match');
        return new AppResponse(
            400,
            'New and confirm password does not match'
        ).send(res);
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        logger.warn('User not found');
        return next(new AppError('Invalid credentials', 401));
    }

    const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordValid) {
        logger.warn('Invalid credentials');
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

    return new AppResponse(200, 'Reset password successfully', {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    }).send(res);
});

const refreshToken = catchAsync(async (req, res, next) => {
    logger.info('Refreshing user token');
    const refreshTokenFromCookie = req.cookies?.refreshToken;

    if (!refreshTokenFromCookie) {
        logger.warn('Refresh token not found in cookies');
        return next(new AppError('Unauthorized', 401));
    }

    let decoded;
    try {
        decoded = jwt.verify(
            refreshTokenFromCookie,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (err) {
        logger.warn('Invalid refresh token');
        return next(new AppError('Unauthorized', 401));
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
        logger.warn('User not found');
        return next(new AppError('User not found', 404));
    }

    if (
        user.refreshToken !== refreshTokenFromCookie ||
        !user.refreshToken ||
        new Date(decoded.exp * 1000) < new Date()
    ) {
        logger.warn('Invalid refresh token');
        return next(new AppError('Unauthorized', 401));
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

    return new AppResponse(200, 'Token refreshed successfully', {
        accessToken: newAccessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    }).send(res);
});

export {
    getCurrentUser,
    registerUser,
    loginUser,
    logoutUser,
    resetPass,
    refreshToken,
};
