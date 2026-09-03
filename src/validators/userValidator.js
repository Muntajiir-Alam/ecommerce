import { validationResult, param, body, query } from 'express-validator';

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

    query('page').isInt().withMessage('Page must be a number'),

    query('limit').isInt().withMessage('Limit must be a number'),

    validateResult,
];

const getUserDetailsValidationRules = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    validateResult,
];

const updateUserRoleValidationRules = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('role')
        .isString()
        .withMessage('Role must be a string')
        .isIn(['admin', 'customer'])
        .withMessage('Role must be either admin or customer'),
    validateResult,
];

const banUserValidationRules = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    validateResult,
];

const unbanUserValidationRules = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    validateResult,
];

const deleteUserValidationRules = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    validateResult,
];

const restoreDeletedUserValidationRules = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    validateResult,
];

const viewUserOrdersValidationRules = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    validateResult,
];

export {
    getUserListValidationRules,
    getUserDetailsValidationRules,
    updateUserRoleValidationRules,
    banUserValidationRules,
    unbanUserValidationRules,
    deleteUserValidationRules,
    restoreDeletedUserValidationRules,
    viewUserOrdersValidationRules,
};
