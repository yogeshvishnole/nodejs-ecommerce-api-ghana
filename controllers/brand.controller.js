import Brand from "../model/brand.model.js";
import asyncHandler from "express-async-handler";

// @desc Create new brand
// @route POST /api/v1/brands
// @access Private/Admin
export const createBrandController = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // if categiry already exists
  const brandFound = await Brand.findOne({ name: name.toLowerCase() });

  if (brandFound) {
    throw new Error("Brand already exists");
  }

  // create it
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  return res.status(201).json({
    success: "true",
    message: "Brand created successfully",
    data: brand,
  });
});

// @desc Get all brands
// @route Get /api/v1/brands
// @access Public
export const getAllBrandsController = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find({});
  res.status(200).json({
    status: "success",
    message: "Brands fetched successfully",
    data: brands,
  });
});

// @desc Get single brand
// @route GET /api/v1/brands/:id
// @access Public
export const getBrandController = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  return res.status(200).json({
    status: "success",
    message: "brand fetched successfully",
    data: brand,
  });
});
// @desc  Update brand
// @route PUT /api/v1/brands/:id
// @access Private/Admin
export const updateBrandController = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  return res.status(200).json({
    status: "success",
    message: "brand updated successfully",
    data: brand,
  });
});
// @desc Delete  brand
// @route DELETE /api/v1/brands/:id
// @access Private/Admin
export const deleteBrandController = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  return res.status(204).json({
    status: "success",
    message: "brand deleted successfully",
    data: brand,
  });
});
