import Order from "../model/order.model.js";
import User from "../model/user.model.js";
import Product from "../model/product.model.js";
import Coupon from "../model/coupon.model.js";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

// create instance of stripe
const stripe = new Stripe(process.env.STRIPE_KEY);

// @desc create orders
// @route POST /api/v1/orders
// @access private

export const createOrderController = asyncHandler(async (req, res) => {
  // get the coupon
  const { coupon } = req.query;

  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });

  if (couponFound?.isExpired) {
    throw new Error("coupon has expired");
  }

  if (!couponFound) {
    throw new Error("coupon does not exists");
  }
  // get the discount
  const discount = couponFound?.discount / 100;
  // Get the payload (customer,orderItems,shippingAddress,totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // Find the user
  const user = await User.findById(req.userAuthId);

  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }

  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }

  // Place/create order - save into db
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });

  // update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
      await product.save();
    }
  });

  // push the order into user
  user.orders.push(order?._id);
  await user.save();

  // convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancek",
  });
  res.send({ url: session.url });
  // res.status(201).json({
  //   success: true,
  //   message: "order created",
  //   order,
  //   user,
  // });
});

// @desc get all orders
// @route GET /api/v1/orders
// @access private
export const getAllOrdersController = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  res.json({
    success: true,
    message: "welcome to orders controller",
    data: orders,
  });
});

// @desc get single order
// @route GET /api/v1/orders/:id
// @access private/admin

export const getSingleOrderController = asyncHandler(async (req, res) => {
  // get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  res.status(200).json({
    success: true,
    message: "single order",
    order,
  });
});

// @desc update order to delivered
// @route PUT /api/v1/orders/:id
// @access private/admin

export const updateOrderController = asyncHandler(async (req, res) => {
  // get the id from params
  const id = req.params.id;
  //update
  const updateOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    data: updateOrder,
  });
});

export const getSalesStatsController = asyncHandler(async (req, res) => {
  // get the sales
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
        minimumSale: {
          $min: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  // send the response
  res.status(200).json({
    success: true,
    message: "stats of orders",
    orderStats,
    saleToday,
  });
});
