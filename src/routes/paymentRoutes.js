import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    initiatePayment,
    getPaymentByOrder,
} from '../controllers/paymentController.js';
import {
    initiatePaymentValidationRules,
    getPaymentByOrderValidationRule,
} from '../validators/paymentValidator.js';

const router = express.Router();

router.post('/', auth, initiatePaymentValidationRules, initiatePayment);
router.get(
    '/order/:orderId',
    auth,
    getPaymentByOrderValidationRule,
    getPaymentByOrder
);

export default router;
