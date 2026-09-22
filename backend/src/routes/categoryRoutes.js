import express from 'express';
import { auth } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';
import {
    createCategoryValidationRules,
    updateCategoryValidationRules,
    getCategoryByIdValidationRule,
} from '../validators/categoryValidator.js';

const router = express.Router();

router.get('/', getCategories); // public
router.get('/:id', getCategoryByIdValidationRule, getCategoryById); // public

router.post(
    '/',
    auth,
    role('admin'),
    createCategoryValidationRules,
    createCategory
);
router.patch(
    '/:id',
    auth,
    role('admin'),
    updateCategoryValidationRules,
    updateCategory
);
router.delete(
    '/:id',
    auth,
    role('admin'),
    getCategoryByIdValidationRule,
    deleteCategory
);

export default router;
