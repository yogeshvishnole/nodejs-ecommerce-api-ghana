import express from "express";
import {
  createColorController,
  getAllColorsController,
  getColorController,
  updateColorController,
  deleteColorController,
} from "../controllers/color.controller.js";
import { isLoggedIn } from "../middlewares/is-loggedin.middleware.js";
import { isAdminMiddleware } from "../middlewares/is-admin.middleware.js";

const colorRoutes = express.Router();

colorRoutes.post("/", isLoggedIn, isAdminMiddleware, createColorController);
colorRoutes.get("/", getAllColorsController);
colorRoutes.get("/:id", getColorController);
colorRoutes.put("/:id", isLoggedIn, isAdminMiddleware, updateColorController);
colorRoutes.delete(
  "/:id",
  isLoggedIn,
  isAdminMiddleware,
  deleteColorController
);

export default colorRoutes;
