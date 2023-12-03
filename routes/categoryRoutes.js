import express from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller.js";
import { isLoggedIn } from "../middlewares/is-loggedin.middleware.js";
import upload from "../config/fileUpload.js";

const categoryRoutes = express.Router();

categoryRoutes.post(
  "/",
  isLoggedIn,
  upload.single("file"),
  createCategoryController
);
categoryRoutes.get("/", getAllCategoriesController);
categoryRoutes.get("/:id", getCategoryController);
categoryRoutes.put("/:id", isLoggedIn, updateCategoryController);
categoryRoutes.delete("/:id", isLoggedIn, deleteCategoryController);

export default categoryRoutes;
