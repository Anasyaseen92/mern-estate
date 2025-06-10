import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  // Extract token from cookies
  const token = req.headers.cookie?.split('=')[1];

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Invalid token'));
    
    req.user = user; // user should contain at least `id`
    next();
  });
};
