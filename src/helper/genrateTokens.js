import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessExpiry = Number(process.env.ACCESS_TOKEN_EXPIRY || 900000);
const refreshExpiry = Number(process.env.REFRESH_TOKEN_EXPIRY || 604800000);

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: accessExpiry }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: refreshExpiry,
    });
};

export { generateAccessToken, generateRefreshToken };
