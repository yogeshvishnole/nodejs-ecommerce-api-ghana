import express from "express";
import { isLoggedIn } from "../middlewares/is-loggedin.middleware.js";
import { createReviewController } from "../controllers/reviews.controller.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productId", isLoggedIn, createReviewController);

export default reviewsRouter;
