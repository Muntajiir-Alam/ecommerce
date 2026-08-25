import express from 'express';
import {
    deleteOrder,
    getOrderById,
    getOrders,
    orderUser,
    updateOrderStatus,
} from '../controllers/orderController.js';
import { authAdmin, authUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authUser, orderUser);
router.get('/', authUser, getOrders);
router.get('/:id', authUser, getOrderById);
router.patch('/:id/status', authAdmin, updateOrderStatus);
router.delete('/:id', authUser || authAdmin, deleteOrder);

export default router;
