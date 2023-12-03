import Color from "../model/color.model.js";
import asyncHandler from "express-async-handler";

// @desc Create new color
// @route POST /api/v1/colors
// @access Private/Admin
export const createColorController = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // if Color already exists
  const colorFound = await Color.findOne({ name: name.toLowerCase() });

  if (colorFound) {
    throw new Error("Color already exists");
  }

  // create it
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  return res.status(201).json({
    success: "true",
    message: "Color created successfully",
    data: color,
  });
});

// @desc Get all colors
// @route Get /api/v1/colors
// @access Public
export const getAllColorsController = asyncHandler(async (req, res, next) => {
  const colors = await Color.find({});
  res.status(200).json({
    status: "success",
    message: "colors fetched successfully",
    data: colors,
  });
});

// @desc Get single color
// @route GET /api/v1/colors/:id
// @access Public
export const getColorController = asyncHandler(async (req, res, next) => {
  const color = await Color.findById(req.params.id);
  return res.status(200).json({
    status: "success",
    message: "color fetched successfully",
    data: color,
  });
});
// @desc  Update color
// @route PUT /api/v1/colors/:id
// @access Private/Admin
export const updateColorController = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  return res.status(200).json({
    status: "success",
    message: "color updated successfully",
    data: color,
  });
});
// @desc Delete  color
// @route DELETE /api/v1/colors/:id
// @access Private/Admin
export const deleteColorController = asyncHandler(async (req, res, next) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  return res.status(204).json({
    status: "success",
    message: "color deleted successfully",
    data: color,
  });
});
