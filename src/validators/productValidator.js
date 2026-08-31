import { body, param, validationResult } from 'express-validator';

async function validateResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
/*
    validation rules for product routes
*/

const addProductValidationRule = [
    body('name').isString().withMessage('Name must be a string'),
    body('description').isString().withMessage('Description must be a string'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
    body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    body('category').isString().withMessage('Category must be a string'),
    validateResult,
];

const getProductByIdValidationRule = [
    param('id').isMongoId().withMessage('Invalid product ID'),
    validateResult,
];

const updateProductValidationRule = [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    body('category')
        .optional()
        .isString()
        .withMessage('Category must be a string'),
    validateResult,
];

const deleteProductValidationRule = [
    param('id').isMongoId().withMessage('Invalid product ID'),
    validateResult,
];

export {
    addProductValidationRule,
    getProductByIdValidationRule,
    updateProductValidationRule,
    deleteProductValidationRule,
};
