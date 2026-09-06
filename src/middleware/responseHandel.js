import logger from '../utils/logger.js';

const responseHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Something went wrong';

    logger.info(`${statusCode} - ${err.message}`, {
        path: req.path,
        method: req.method,
        stack: err.stack,
    });

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default responseHandler;