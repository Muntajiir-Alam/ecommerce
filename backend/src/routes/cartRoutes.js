import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    addToCartValidationRules,
    removeCartItemValidationRules,
    updateCartItemValidationRules,
} from '../validators/cartValidator.js';
import {
    addToCart,
    getCart,
    checkout,
    clearCart,
    removeCartItem,
    updateCartItem,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', auth, getCart);
router.post('/', auth, addToCartValidationRules, addToCart);
router.patch(
    '/:productId',
    auth,
    updateCartItemValidationRules,
    updateCartItem
);
router.delete(
    '/:productId',
    auth,
    removeCartItemValidationRules,
    removeCartItem
);
router.delete('/', auth, clearCart);
router.post('/checkout', auth, checkout);

export default router;
