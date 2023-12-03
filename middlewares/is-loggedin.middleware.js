import { getTokenFromHeaders } from "../utils/util.js";
import { verifyToken } from "../utils/verify-token.js";
import asyncHandler from "express-async-handler";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  // get token from header
  const token = getTokenFromHeaders(req);
  // verify the token
  const decodedUser = await verifyToken(token);

  if (!decodedUser) {
    throw new Error("Invalid/Expired token, please login again");
  }
  // save the user into req obj
  req.userAuthId = decodedUser.id;
  next();
});
