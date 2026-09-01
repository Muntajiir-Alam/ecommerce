import userModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import tokenGen from '../helper/tokenGen.js';
import hashGen from '../helper/hashGen.js';
import jwt from 'jsonwebtoken';

async function getCurrentUser(req, res) {
    if (!req.cookies?.token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            return decoded.id;
        }
    );

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    });
}

async function registerUser(req, res) {
    const { username, email, password, role = 'customer' } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hash = hashGen(password);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role,
    });

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
}

async function loginUser(req, res) {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
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
}

async function logoutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out successfully' });
}

async function resetPass(req, res) {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: 'New and confirm password does not match',
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
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
}

export { getCurrentUser, registerUser, loginUser, logoutUser, resetPass };
