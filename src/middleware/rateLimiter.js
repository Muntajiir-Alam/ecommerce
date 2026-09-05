import rateLimit from 'express-rate-limit';


export const generalLimiter = rateLimit({
    windowMs:  60 * 1000, // 15 minutes
    max: 3, // 100 requests per IP per window
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message:
                'Too many requests, please try again after 15 minutes',
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // only 5 attempts per IP per window

    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message:
                'Too many login attempts, please try again after 15 minutes',
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});