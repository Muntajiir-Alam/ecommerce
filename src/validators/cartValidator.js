// validators/cartValidator.js
import { body, param } from 'express-validator';
import validateResult from '../middleware/validate.js';
/*
GET    /cart              → view own cart
POST   /cart               → add item to cart
PATCH  /cart/:productId    → update quantity of an item
DELETE /cart/:productId    → remove an item
DELETE /cart                → clear entire cart
*/
export const addToCartValidationRules = [
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validateResult,
];

export const updateCartItemValidationRules = [
    param('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validateResult,
];

export const removeCartItemValidationRules = [
    param('productId').isMongoId().withMessage('Invalid product ID'),
    validateResult,
];