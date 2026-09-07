import reviewModel from '../models/review.js';
import productModel from '../models/product.js';
import orderModel from '../models/order.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import AppResponse from '../utils/appResponse.js';

const updateProductRatingStats = async (productId) => {
    const stats = await reviewModel.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                numReviews: { $sum: 1 },
            },
        },
    ]);

    await productModel.findByIdAndUpdate(productId, {
        averageRating: stats.length > 0 ? stats[0].averageRating.toFixed(1) : 0,
        numReviews: stats.length > 0 ? stats[0].numReviews : 0,
    });
};

export const createReview = catchAsync(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    const hasPurchased = await orderModel.exists({
        user: req.user.id,
        'items.product': productId,
        status: 'delivered',
    });

    if (!hasPurchased) {
        return next(
            new AppError(
                'You can only review products you have purchased and received',
                403
            )
        );
    }

    const existingReview = await reviewModel.findOne({
        user: req.user.id,
        product: productId,
    });
    if (existingReview) {
        return next(
            new AppError('You have already reviewed this product', 409)
        );
    }

    const review = await reviewModel.create({
        user: req.user.id,
        product: productId,
        rating,
        comment,
    });

    await updateProductRatingStats(productId);

    return new AppResponse(201, 'Review submitted successfully', review).send(
        res
    );
});

export const getProductReviews = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const reviews = await reviewModel
        .find({ product: productId })
        .populate('user', 'name');

    return new AppResponse(200, 'Reviews fetched successfully', reviews).send(
        res
    );
});

export const updateReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;      
    const review = await reviewModel.findById(id);

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    if (review.user.toString() !== req.user.id) {
        return next(new AppError('You can only edit your own review', 403));
    }

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();

    await updateProductRatingStats(review.product);

    return new AppResponse(200, 'Review updated successfully', review).send(
        res
    );
});

export const deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const review = await reviewModel.findById(id);

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new AppError('You are not allowed to delete this review', 403)
        );
    }

    const productId = review.product;
    await review.deleteOne();

    await updateProductRatingStats(productId);

    return new AppResponse(200, 'Review deleted successfully', null).send(res);
});
