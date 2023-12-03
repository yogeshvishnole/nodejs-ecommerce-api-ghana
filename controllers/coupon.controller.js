import asyncHandler from "express-async-handler";

import Coupon from "../model/coupon.model.js";

// @desc Create new coupon
// @route POST /api/coupons
// @access Private/Admin
export const createCouponController = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  // check if admin

  // check if coupon already exists
  const couponExists = await Coupon.findOne({
    code,
  });

  if (couponExists) {
    throw new Error("Coupon already exists");
  }

  // check if discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount value must be a number");
  }

  // create coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "success",
    message: "coupon created successfully",
    coupon,
  });
});

// @desc Get all coupons
// @route GET /api/v1/coupons
// @access Private/Admin
export const getCouponController = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});

// @desc Get single coupon
// @route GET /api/v1/coupons/:id
// @access Private/Admin
export const getSingleCouponController = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});
// @desc Update coupon
// @route GET /api/v1/coupons/:id
// @access Private/Admin
export const updateCouponController = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});

// @desc Get Delete coupon
// @route GET /api/v1/coupons/:id
// @access Private/Admin
export const deleteCouponController = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Coupon deleted successfully",
    coupon,
  });
});
