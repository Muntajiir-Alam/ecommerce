import mongoose from 'mongoose';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';

connectDB();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
        logger.info('HTTP server closed — no longer accepting new connections');

        try {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed');
            process.exit(0);
        } catch (error) {
            logger.error('Error during shutdown', { error: error.message });
            process.exit(1);
        }
    });

    // Force shutdown if it takes too long (safety net)
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000); // 10 seconds
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
