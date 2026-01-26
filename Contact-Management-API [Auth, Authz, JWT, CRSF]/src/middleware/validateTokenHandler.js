import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";

const tokenValidator = asyncHandler((req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authorization header missing or invalid");
  }

  const token = authHeader.split(" ")[1].trim();

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { issuer: "your-app-name" }, (err, decoded) => {
    if (err) {
      res.status(401);

      if (err.name === "TokenExpiredError") {
        throw new Error("Token expired, please login again");
      }

      throw new Error("User is unauthorized");
    }

    req.user = decoded.user;
    next();
  });
});

export default tokenValidator;
