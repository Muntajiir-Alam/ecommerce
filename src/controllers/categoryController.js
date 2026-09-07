import categoryModel from '../models/category.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import AppResponse from '../utils/appResponse.js';

export const createCategory = catchAsync(async (req, res, next) => {
    const category = await categoryModel.create(req.body);
    return new AppResponse(201, 'Category created successfully', category).send(res);
});

export const getCategories = catchAsync(async (req, res, next) => {
    const categories = await categoryModel.find({ isActive: true });
    return new AppResponse(200, 'Categories fetched successfully', categories).send(res);
});

export const getCategoryById = catchAsync(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    return new AppResponse(200, 'Category fetched successfully', category).send(res);
});

export const updateCategory = catchAsync(async (req, res, next) => {
    const category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    return new AppResponse(200, 'Category updated successfully', category).send(res);
});

export const deleteCategory = catchAsync(async (req, res, next) => {
    const category = await categoryModel.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    );

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    return new AppResponse(200, 'Category deactivated successfully', category).send(res);
});