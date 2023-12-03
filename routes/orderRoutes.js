import express from "express";
import { isLoggedIn } from "../middlewares/is-loggedin.middleware.js";
import {
  createOrderController,
  getAllOrdersController,
  getSalesStatsController,
  getSingleOrderController,
  updateOrderController,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderController);
orderRouter.get("/", isLoggedIn, getAllOrdersController);
orderRouter.get("/sales/sum", isLoggedIn, getSalesStatsController);
orderRouter.get("/:id", isLoggedIn, getSingleOrderController);
orderRouter.put("/:id", isLoggedIn, updateOrderController);

export default orderRouter;
