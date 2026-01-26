import asyncHandler from "./asyncHandler.js";
import { verifyCsrfToken } from "../utils/csrf.js";

const csrfProtection = asyncHandler((req, res, next) => {
  const csrfCookie = req.cookies.csrfToken;
  const csrfHeader = req.headers["x-csrf-token"];

  if (!verifyCsrfToken(csrfCookie, csrfHeader)) {
    res.status(403);
    throw new Error("Invalid CSRF token");
  }

  next();
});

export default csrfProtection;