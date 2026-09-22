import wishlistModel from '../models/wishlist.js';
import productModel from '../models/product.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import AppResponse from '../utils/appResponse.js';

export const addToWishlist = catchAsync(async (req, res, next) => {
    const { productId } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    let wishlist = await wishlistModel.findOne({ user: req.user.id });

    if (!wishlist) {
        wishlist = await wishlistModel.create({ user: req.user.id, products: [productId] });
    } else {
        const alreadyExists = wishlist.products.some((p) => p.toString() === productId);

        if (alreadyExists) {
            return next(new AppError('Product already in wishlist', 409));
        }

        wishlist.products.push(productId);
        await wishlist.save();
    }

    return new AppResponse(200, 'Product added to wishlist', wishlist).send(res);
});

export const getWishlist = catchAsync(async (req, res, next) => {
    const wishlist = await wishlistModel.findOne({ user: req.user.id }).populate('products');

    if (!wishlist) {
        return new AppResponse(200, 'Wishlist is empty', { products: [] }).send(res);
    }

    return new AppResponse(200, 'Wishlist fetched successfully', wishlist).send(res);
});

export const removeFromWishlist = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    const wishlist = await wishlistModel.findOne({ user: req.user.id });

    if (!wishlist) {
        return next(new AppError('Wishlist not found', 404));
    }

    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    await wishlist.save();

    return new AppResponse(200, 'Product removed from wishlist', wishlist).send(res);
});