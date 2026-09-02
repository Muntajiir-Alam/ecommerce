import express from 'express';
import {
    listUsers,
    viewUserDetails,
    updateUserRole,
    banUser,
    deleteUser,
    viewUserOrders,
} from '../controllers/userController.js';
import { role } from '../middleware/role.js';
import { auth } from '../middleware/auth.js';
import {
    getUserDetailsValidationRules,
    getUserListValidationRules,
} from '../validators/userValidator.js';

const router = express.Router();

router.get('/', getUserListValidationRules, auth, role('admin'), listUsers);
router.get(
    '/:id',
    getUserDetailsValidationRules,
    auth,
    role('admin'),
    viewUserDetails
);
router.put('/:id/role', updateUserRole);
router.put('/:id/ban', banUser);
router.delete('/:id', deleteUser);
router.get('/:id/orders', viewUserOrders);

export default router;
