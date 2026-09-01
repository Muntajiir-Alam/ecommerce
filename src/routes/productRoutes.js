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
    storage: multer.memoryStorage(),
    limits: {
        files: 5,
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image')) {
            const error = new Error('Only image files are allowed');
            error.status = 400;
            return callback(error);
        }

        return callback(null, true);
    },
});

function uploadProductImages(req, res, next) {
    upload.array('productImages', 5)(req, res, (error) => {
        if (error) {
            return res
                .status(error.status || 400)
                .json({ message: error.message });
        }

        return next();
    });
}

const router = express.Router();

router.post(
    '/',
    auth,
    role('admin'),
    uploadProductImages,
    addProductValidationRule,
    addProduct
);
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
