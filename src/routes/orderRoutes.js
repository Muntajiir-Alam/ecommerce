import express from 'express';
import {
    deleteOrder,
    getOrderById,
    getOrders,
    orderUser,
    updateOrderStatus,
} from '../controllers/orderController.js';
import { auth } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import {
    deleteOrderValidationRule,
    getOrderByIdValidationRule,
    orderValidationRule,
    updateOrderStatusValidationRule,
} from '../validators/orderValidator.js';

const router = express.Router();

router.post('/', orderValidationRule, auth, role('customer'), orderUser);
router.get('/', auth, role('customer'), getOrders);
router.get(
    '/:id',
    getOrderByIdValidationRule,
    auth,
    role('customer'),
    getOrderById
);
router.patch(
    '/:id/status',
    updateOrderStatusValidationRule,
    auth,
    role('admin'),
    updateOrderStatus
);
router.delete(
    '/:id',
    deleteOrderValidationRule,
    auth,
    role('customer', 'admin'),
    deleteOrder
);

export default router;
