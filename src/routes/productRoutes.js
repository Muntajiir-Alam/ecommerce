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

const router = express.Router();

router.post('/', auth, role('admin'), addProduct);
router.get('/', auth, role('admin', 'customer'), getProducts);
router.get('/:id', auth, role('admin', 'customer'), getProductById);
router.patch('/:id', auth, role('admin'), updateProduct);
router.delete('/:id', auth, role('admin'), deleteProduct);

export default router;
