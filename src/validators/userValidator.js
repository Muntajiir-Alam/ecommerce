import { validationResult, param , body, query } from "express-validator";

async function validateResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const getUserListValidationRules = [
    query('search')
        .isString()
        .withMessage('Search must be a string')
        .isLength({ min: 3 })
        .withMessage('Search must be at least 3 characters long'),
    
    query('role')
        .isString()
        .withMessage('Role must be a string')
        .isIn(['admin', 'customer'])
        .withMessage('Role must be either admin or customer'),
    
    query('page')
        .isInt()
        .withMessage('Page must be a number'),

    query('limit')
        .isInt()
        .withMessage('Limit must be a number'),
    
    validateResult,
];

export { getUserListValidationRules };