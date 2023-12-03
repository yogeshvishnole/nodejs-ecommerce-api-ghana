export const getTokenFromHeaders = (req) => {
  return req.headers?.authorization?.split(" ")[1];
};
