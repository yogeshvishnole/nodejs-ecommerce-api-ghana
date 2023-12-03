import User from "../model/user.model.js";

export const isAdminMiddleware = async (req, res, next) => {
  // find the loggedin user
  const user = await User.findById(req.userAuthId);
  // check if admin
  if (user.isAdmin) {
    next();
  } else {
    next(new Error("Access denied, admin only"));
  }
};
