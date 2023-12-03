import express from "express";
import upload from "../config/fileUpload.js";
import {
  createProductController,
  getProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";
import { isLoggedIn } from "../middlewares/is-loggedin.middleware.js";
import { isAdminMiddleware } from "../middlewares/is-admin.middleware.js";

const productRoutes = express.Router();

productRoutes.post(
  "/",
  isLoggedIn,
  isAdminMiddleware,
  upload.array("files"),
  createProductController
);
productRoutes.get("/", getProductsController);
productRoutes.get("/:id", getProductController);
productRoutes.put(
  "/:id",
  isLoggedIn,
  isAdminMiddleware,
  updateProductController
);
productRoutes.delete(
  "/:id",
  isLoggedIn,
  isAdminMiddleware,
  deleteProductController
);

export default productRoutes;
