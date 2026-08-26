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

const router = express.Router();

router.post('/', auth, role('customer'), orderUser);
router.get('/', auth, role('customer'), getOrders);
router.get('/:id', auth, role('customer'), getOrderById);
router.patch('/:id/status', auth, role('admin'), updateOrderStatus);
router.delete('/:id', auth, role('customer', 'admin'), deleteOrder);

export default router;
