import asyncHandler from "express-async-handler";
import Product from "../model/product.model.js";
import Category from "../model/category.model.js";
import Brand from "../model/brand.model.js";

// @desc Create new product
// POST /api/v1/products
// @access Private/Admin
export const createProductController = asyncHandler(async (req, res) => {
  const productImages = req.files.map((file) => file.path);
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;

  // check Product exists
  const productExists = await Product.findOne({ name });

  if (productExists) {
    throw new Error("Product already exists");
  }

  const categoryFound = await Category.findOne({
    name: category.toLowerCase(),
  });

  if (!categoryFound) {
    throw new Error(
      "category not found, please create category first or check category name"
    );
  }
  const brandFound = await Brand.findOne({ name: brand.toLowerCase() });

  if (!brandFound) {
    throw new Error(
      "brand not found, please create brand first or check brand name"
    );
  }

  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: productImages,
  });
  //push the product into category
  categoryFound.products.push(product._id);
  // resave the category
  await categoryFound.save();
  //push the product into brand
  brandFound.products.push(product._id);
  // resave the brand
  await brandFound.save();

  // send the response
  return res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

// @desc Get all products
// @route GET /api/v1/products
// @access Public

export const getProductsController = asyncHandler(async (req, res) => {
  const { name, brand, category, colors, size, price } = req.query;
  let productsQuery = Product.find();

  //search by name
  if (name) {
    productsQuery = Product.find({ name: { $regex: name, $options: "i" } });
  }
  // filter by brand
  if (brand) {
    productsQuery = Product.find({ name: { $regex: brand, $options: "i" } });
  }
  // filter by category
  if (category) {
    productsQuery = Product.find({ name: { $regex: category, $options: "i" } });
  }
  // filter by colors
  if (colors) {
    productsQuery = Product.find({ name: { $regex: colors, $options: "i" } });
  }
  // filter by size
  if (size) {
    productsQuery = Product.find({ name: { $regex: size, $options: "i" } });
  }
  // filter by priceRange
  if (price) {
    const priceRange = price.split("-");
    productsQuery = Product.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  // pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();

  productsQuery = productsQuery.skip(startIndex).limit(limit);

  // pagination results
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const products = await productsQuery.populate("reviews");
  return res.status(200).json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    data: products,
  });
});

// @desc Get single product
// @route Get /api/v1/products/:id
// @access Public
export const getProductController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById({ _id: id }).populate("reviews");

  const avgRating =
    product.reviews.reduce((prev, cur) => {
      return prev + cur.rating;
    }, 0) / product.reviews.length;

  if (!product) {
    throw new Error("Product not found");
  }
  return res.status(200).json({
    status: "success",
    message: "Product fetched successfully",
    data: product,
    avgRating: avgRating,
  });
});

// @desc update product
// @route PUT /api/products/:id
// @access Private/Admin
export const updateProductController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      price,
      totalQty,
      brand,
    },
    {
      new: true,
    }
  );
  return res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});

// @desc Delete product
// @route Delete /api/v1/products/:id
// @access Private/Admin
export const deleteProductController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  return res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: product,
  });
});
