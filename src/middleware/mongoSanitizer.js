import mongoSanitize from 'express-mongo-sanitize';

export const mongoSanitizer = (req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);

    if (req.params) req.params = mongoSanitize.sanitize(req.params);
    next();
};
