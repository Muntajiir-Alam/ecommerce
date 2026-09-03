import productModel from '../models/product.js';
import uploadFile from '../servise/img.storage.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const addProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, stock, category } = req.body;
    const productImages = req.files ?? [];

    if (productImages.length === 0) {
        return next(
            new AppError('At least one product image is required', 400)
        );
    }

    let uploads;

    try {
        uploads = await Promise.all(
            productImages.map((file, index) =>
                uploadFile(
                    file.buffer.toString('base64'),
                    `product-${Date.now()}-${index}-${file.originalname}`
                )
            )
        );
    } catch (error) {
        const status = Number.isInteger(error.status) ? error.status : 500;
        const message = error.error?.message || error.message;

        console.error('ImageKit upload failed:', {
            status: error.status,
            message,
        });

        return next(
            new AppError(
                `Image upload failed: ${message || 'Unknown ImageKit error'}`,
                status
            )
        );
    }

    const imageUrls = uploads.map((upload) => upload.url);

    const product = await productModel.create({
        imagesUrls: imageUrls,
        name,
        description,
        price,
        stock,
        category,
    });

    res.status(201).json({ message: 'Product added successfully', product });
});

const getProducts = catchAsync(async (req, res, next) => {
    const products = await productModel.find();

    if (!products || products.length === 0) {
        return next(new AppError('No products found', 404));
    }

    res.status(200).json({ products });
});

const getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    res.status(200).json({ product });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await productModel.findByIdAndUpdate(
        id,
        { name, description, price, stock, category },
        { new: true }
    );

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    res.status(200).json({ message: 'Product updated successfully', product });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    res.status(200).json({ message: 'Product deleted successfully' });
});

export {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
