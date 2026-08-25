import express from 'express';
import {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/procductController.js';
import { authAdmin, authUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/',authAdmin, addProduct);
router.get('/', authAdmin || authUser, getProducts);
router.get('/:id', authAdmin, getProductById);
router.patch('/:id', authAdmin, updateProduct);
router.delete('/:id', authAdmin, deleteProduct);

export default router;
