import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Something went wrong';

    try {
        logger.error(`${statusCode} - ${err.message}`, {
            path: req.path,
            method: req.method,
            stack: err.stack,
        });
    } catch (loggerError) {
        console.error('Error logger failed:', loggerError.message);
    }

    if (err.name === 'CastError') {
        return res
            .status(400)
            .json({ success: false, message: 'Invalid ID format' });
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorHandler;
