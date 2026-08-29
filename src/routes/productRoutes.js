import express from 'express';
import {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/procductController.js';
import { auth } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import {
    addProductValidationRule,
    deleteProductValidationRule,
    getProductByIdValidationRule,
    updateProductValidationRule,
} from '../validators/productValidator.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post('/', addProductValidationRule, auth, role('admin'), addProduct);
router.get('/', auth, role('admin', 'customer'), getProducts);
router.get(
    '/:id',
    getProductByIdValidationRule,
    auth,
    role('admin', 'customer'),
    getProductById
);
router.patch(
    '/:id',
    updateProductValidationRule,
    auth,
    role('admin'),
    updateProduct
);
router.delete(
    '/:id',
    deleteProductValidationRule,
    auth,
    role('admin'),
    deleteProduct
);

export default router;
