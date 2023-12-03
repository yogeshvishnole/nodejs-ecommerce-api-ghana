import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateToken } from "../utils/generate-token.js";
import Order from "../model/order.model.js";
import User from "../model/user.model.js";

// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUserController = asyncHandler(async (req, res) => {
  const { email, fullname, password } = req.body;
  // Check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create the user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    data: user,
  });
});

// @desc Login user
// @route POST /api/v1/users/login
// @access Private/Admin
export const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Find the user in db by email only
  const userFound = await User.findOne({ email });

  if (userFound && (await bcrypt.compare(password, userFound.password))) {
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      user: userFound,
      token: generateToken(userFound._id),
    });
  } else {
    throw new Error("Invalid login details");
  }
});

// @desc Get user profile
// @route GET /api/v1/users/profile
// @access Private
export const getUserProfileController = asyncHandler(async (req, res) => {
  // find the user
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    message: "Welcome to profile page",
    data: user,
  });
});

// @desc Update user shipping address
// @route PUT /api/v1/users/update/shipping
// @access Private

export const updateShippingAddressController = asyncHandler(
  async (req, res) => {
    const { firstName, lastName, address, city, postalCode, province, phone } =
      req.body;

    const user = await User.findByIdAndUpdate(
      req.userAuthId,
      {
        shippingAddress: {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          phone,
        },
        hasShippingAddress: true,
      },
      { new: true }
    );
    res.json({
      status: "success",
      message: "User shipping address updated successfully",
      user,
    });
  }
);
