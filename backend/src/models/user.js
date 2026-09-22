import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['customer', 'admin', 'seller'],
            default: 'customer',
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },

        refreshToken: {
            type: String,
            default: null,
        },
        failedLoginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date, default: null },
        storeName: { type: String, default: '' },
        isApprovedSeller: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const userModel = mongoose.model('User', userSchema);
export default userModel;
