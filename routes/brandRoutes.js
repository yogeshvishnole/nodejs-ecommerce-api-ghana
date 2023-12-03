import express from "express";
import {
  createBrandController,
  getAllBrandsController,
  getBrandController,
  updateBrandController,
  deleteBrandController,
} from "../controllers/brand.controller.js";
import { isLoggedIn } from "../middlewares/is-loggedin.middleware.js";
import { isAdminMiddleware } from "../middlewares/is-admin.middleware.js";

const brandRoutes = express.Router();

brandRoutes.post("/", isLoggedIn, isAdminMiddleware, createBrandController);
brandRoutes.get("/", getAllBrandsController);
brandRoutes.get("/:id", getBrandController);
brandRoutes.put("/:id", isLoggedIn, isAdminMiddleware, updateBrandController);
brandRoutes.delete(
  "/:id",
  isLoggedIn,
  isAdminMiddleware,
  deleteBrandController
);

export default brandRoutes;
