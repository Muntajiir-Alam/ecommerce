import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('MongoDB connected');
    } catch (error) {
        logger.error('Database connection error:', { error: error.message });
    }
};

export default connectDB;
