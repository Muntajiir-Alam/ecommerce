import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    createReviewValidationRules,
    updateReviewValidationRules,
    deleteReviewValidationRule,
} from '../validators/reviewValidator.js';
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
} from '../controllers/reviewControler.js';

const router = express.Router();

router.post('/', auth, createReviewValidationRules, createReview);
router.get('/product/:productId', getProductReviews); // public
router.patch('/:id', auth, updateReviewValidationRules, updateReview);
router.delete('/:id', auth, deleteReviewValidationRule, deleteReview);

export default router;
