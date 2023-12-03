import express from "express";

import { isLoggedIn } from "../middlewares/is-loggedin.middleware.js";
import {
  createCouponController,
  deleteCouponController,
  getCouponController,
  getSingleCouponController,
  updateCouponController,
} from "../controllers/coupon.controller.js";
import { isAdminMiddleware } from "../middlewares/is-admin.middleware.js";

const couponRouter = express.Router();

couponRouter.post("/", isLoggedIn, isAdminMiddleware, createCouponController);
couponRouter.get("/", isLoggedIn, getCouponController);
couponRouter.get("/:id", isLoggedIn, getSingleCouponController);
couponRouter.put("/:id", isLoggedIn, isAdminMiddleware, updateCouponController);
couponRouter.delete(
  "/:id",
  isLoggedIn,
  isAdminMiddleware,
  deleteCouponController
);

export default couponRouter;
