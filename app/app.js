import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "../config/dbConnect.js";
import Order from "../model/order.model.js";

import { globalErrorMiddleware } from "../middlewares/global-error.middleware.js";
import asyncHandler from "express-async-handler";
import productRoutes from "../routes/productRoutes.js";
import categoryRoutes from "../routes/categoryRoutes.js";
import brandRoutes from "../routes/brandRoutes.js";
import colorRoutes from "../routes/colorRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import reviewRoutes from "../routes/reviewRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import couponRoutes from "../routes/couponRoutes.js";

import Stripe from "stripe";

const app = express();

// create instance of stripe
const stripe = new Stripe(process.env.STRIPE_KEY);

// stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_b81f6b9f53c33afd3c16b1f432a8f40b94e2cc69823435f1ffa7f3668b5a0906";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    console.log("hello stripe");
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event", event);
    } catch (err) {
      console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log("event", event);

    if (event.type === "checkout.session.completed") {
      // update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        { new: true }
      );
    } else {
      return;
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

dbConnect();

// parse incoming data
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/colors", colorRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/coupons", couponRoutes);

app.use(
  "*",
  asyncHandler((req, res, next) => {
    throw new Error(`Route ${req.originalUrl} not found`);
  })
);
// global error handler middleware
app.use(globalErrorMiddleware);

export default app;
