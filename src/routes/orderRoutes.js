import express from 'express';
import {
    deleteOrder,
    getOrderById,
    getOrders,
    getOrderTracking,
    orderUser,
    updateOrderStatus,
} from '../controllers/orderController.js';
import { auth } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import {
    deleteOrderValidationRule,
    getOrderByIdValidationRule,
    getOrderTrackingValidationRule,
    orderValidationRule,
    updateOrderStatusValidationRule,
} from '../validators/orderValidator.js';

const router = express.Router();

router.post('/', auth, role('customer'), orderValidationRule, orderUser);
router.get('/', auth, role('customer'), getOrders);
router.get(
    '/:id',
    auth,
    role('customer'),
    getOrderByIdValidationRule,
    getOrderById
);
router.patch(
    '/:id/status',
    auth,
    role('admin'),
    updateOrderStatusValidationRule,
    updateOrderStatus
);
router.delete(
    '/:id',
    auth,
    role('customer', 'admin'),
    deleteOrderValidationRule,
    deleteOrder
);
router.get(
    '/:id/tracking',
    auth,
    getOrderTrackingValidationRule,
    getOrderTracking
);

export default router;
