import asyncHandler from "express-async-handler";
import Review from "../model/review.model.js";
import Product from "../model/product.model.js";

// @desc Create new review
// @route POST /api/v1/reviews
// @access Private/Admin
export const createReviewController = asyncHandler(async (req, res, next) => {
  const { message, rating } = req.body;

  // 1. Find the product
  const { productId } = req.params;
  const productFound = await Product.findById(productId).populate("reviews");

  if (!productFound) {
    throw new Error("Product not found");
  }

  // check if user already reviewed this product
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });

  if (hasReviewed) {
    throw new Error("You have already reviewed this product");
  }

  // create review
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });

  productFound.reviews.push(review?._id);

  await productFound.save();

  res.status(200).json({
    success: true,
    message: "review created successfully",
  });
});
