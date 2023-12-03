import express from "express";
import {
  getUserProfileController,
  loginUserController,
  registerUserController,
  updateShippingAddressController,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/is-loggedin.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUserController);
userRoutes.post("/login", loginUserController);
userRoutes.get("/profile", isLoggedIn, getUserProfileController);
userRoutes.post(
  "/update/shipping",
  isLoggedIn,
  updateShippingAddressController
);

export default userRoutes;
