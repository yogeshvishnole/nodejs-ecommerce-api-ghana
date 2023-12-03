import Category from "../model/category.model.js";
import asyncHandler from "express-async-handler";

// @desc Create new category
// @route POST /api/v1/categories
// @access Private/Admin
export const createCategoryController = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // if categiry already exists
  const categoryFound = await Category.findOne({ name: name.toLowerCase() });

  if (categoryFound) {
    throw new Error("Category already exists");
  }

  // create it
  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  });

  return res.status(201).json({
    success: "true",
    message: "Category created successfully",
    data: category,
  });
});

// @desc Get all categories
// @route Get /api/v1/categories
// @access Public
export const getAllCategoriesController = asyncHandler(
  async (req, res, next) => {
    const categories = await Category.find({});
    res.status(200).json({
      status: "success",
      message: "Categories fetched successfully",
      data: categories,
    });
  }
);

// @desc Get single category
// @route GET /api/v1/categories/:id
// @access Public
export const getCategoryController = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  return res.status(200).json({
    status: "success",
    message: "Category fetched successfully",
    data: category,
  });
});
// @desc  Update category
// @route PUT /api/v1/categories/:id
// @access Private/Admin
export const updateCategoryController = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  return res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: category,
  });
});
// @desc Delete  category
// @route DELETE /api/v1/categories/:id
// @access Private/Admin
export const deleteCategoryController = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  return res.status(204).json({
    status: "success",
    message: "Category deleted successfully",
    data: category,
  });
});
