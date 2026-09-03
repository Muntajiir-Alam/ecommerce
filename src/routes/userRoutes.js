import express from 'express';
import {
    listUsers,
    viewUserDetails,
    updateUserRole,
    banUser,
    unbanUser,
    deleteUser,
    restoreDeletedUser,
    viewUserOrders,
} from '../controllers/userController.js';
import { role } from '../middleware/role.js';
import { auth } from '../middleware/auth.js';
import {
    getUserDetailsValidationRules,
    getUserListValidationRules,
    updateUserRoleValidationRules,
    banUserValidationRules,
    unbanUserValidationRules,
    deleteUserValidationRules,
    restoreDeletedUserValidationRules,
    viewUserOrdersValidationRules,
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
router.patch(
    '/:id/role',
    updateUserRoleValidationRules,
    auth,
    role('admin'),
    updateUserRole
);
router.patch('/:id/ban', banUserValidationRules, auth, role('admin'), banUser);
router.patch(
    '/:id/unban',
    unbanUserValidationRules,
    auth,
    role('admin'),
    unbanUser
);
router.patch(
    '/:id/delete',
    deleteUserValidationRules,
    auth,
    role('admin'),
    deleteUser
);
router.patch(
    '/:id/restore',
    restoreDeletedUserValidationRules,
    auth,
    role('admin'),
    restoreDeletedUser
);
router.get(
    '/:id/orders',
    viewUserOrdersValidationRules,
    auth,
    role('admin'),
    viewUserOrders
);

export default router;
