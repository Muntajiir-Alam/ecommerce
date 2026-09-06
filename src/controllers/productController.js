import productModel from '../models/product.js';
import uploadFile from '../service/img.storage.js';
import AppError from '../utils/appError.js';
import AppResponse from '../utils/appResponse.js';
import catchAsync from '../utils/catchAsync.js';

const addProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, stock, category } = req.body;

    if (req.user.role === 'seller' && !req.user.isApprovedSeller) {
        return next(
            new AppError('Your seller account is pending approval', 403)
        );
    }
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
        seller: req.user._id,
    });
    return new AppResponse(201, 'Product added successfully', { product }).send(
        res
    );
});

const getProducts = catchAsync(async (req, res, next) => {
    const products = await productModel.find();

    if (!products || products.length === 0) {
        return next(new AppError('No products found', 404));
    }
    return new AppResponse(200, 'Featched all products', { products }).send(
        res
    );
});

const getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    return new AppResponse(200, 'Fetch by id', { product }).send(res);
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

    if (
        req.user.role !== 'admin' &&
        product.seller.toString() !== req.user.id
    ) {
        return next(
            new AppError('You are not allowed to modify this product', 403)
        );
    }
    return new AppResponse(200, 'Product updated successfully', {
        product,
    }).send(res);
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    if (
        req.user.role !== 'admin' &&
        product.seller.toString() !== req.user.id
    ) {
        return next(
            new AppError('You are not allowed to modify this product', 403)
        );
    }
    return new AppResponse(200, 'Product deleted successfully', null).send(res);
});

const getMyProducts = catchAsync(async (req, res, next) => {
    const products = await productModel.find({ seller: req.user.id });

    return new AppResponse(200, 'Your products fetched successfully', products).send(res);
});

export {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getMyProducts,
};
