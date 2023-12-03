import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
  try {
    const decodedData = await jwt.verify(token, process.env.JWT_KEY);
    return decodedData;
  } catch (error) {
    return false;
  }
};
