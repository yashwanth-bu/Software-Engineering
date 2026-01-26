import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshToken } from "../controller/userControllers.js";
import tokenValidator from "../middleware/validateTokenHandler.js";
import refreshLimiter from "../utils/refreshLimiter.js";
import csrfProtection from "../middleware/csrfProtection.js";

const router = Router()

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh-token", refreshLimiter,  csrfProtection, refreshToken);

router.delete("/logout", tokenValidator, csrfProtection, logoutUser);

export default router