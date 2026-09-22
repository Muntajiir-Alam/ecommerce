import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from '../controllers/wishlistController.js';
import {
    addToWishlistValidationRules,
    removeFromWishlistValidationRule,
} from '../validators/wishlistValidator.js';

const router = express.Router();

router.get('/', auth, getWishlist);
router.post('/', auth, addToWishlistValidationRules, addToWishlist);
router.delete(
    '/:productId',
    auth,
    removeFromWishlistValidationRule,
    removeFromWishlist
);

export default router;
