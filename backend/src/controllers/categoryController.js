import categoryModel from '../models/category.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import AppResponse from '../utils/appResponse.js';

export const createCategory = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
    const isAlready = await categoryModel.findOne({ name });
    console.log(isAlready);
    

    if (isAlready)
        return next(new AppError('Category already exists', 401));
    const category = await categoryModel.create({
        name,
        description,
    });
    return new AppResponse(201, 'Category created successfully', category).send(
        res
    );
});

export const getCategories = catchAsync(async (req, res, next) => {
    const categories = await categoryModel.find();
    return new AppResponse(
        200,
        'Categories fetched successfully',
        categories
    ).send(res);
});

export const getCategoryById = catchAsync(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    return new AppResponse(200, 'Category fetched successfully', category).send(
        res
    );
});

export const updateCategory = catchAsync(async (req, res, next) => {
    const category = await categoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    return new AppResponse(200, 'Category updated successfully', category).send(
        res
    );
});

export const deleteCategory = catchAsync(async (req, res, next) => {
    const category = await categoryModel.findByIdAndDelete(
        req.params.id,
    );

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    return new AppResponse(
        200,
        'Category deleted successfully',
        category
    ).send(res);
});
