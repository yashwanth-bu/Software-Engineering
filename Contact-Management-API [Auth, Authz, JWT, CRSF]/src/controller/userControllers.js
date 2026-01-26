import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

import asyncHandler from "../middleware/asyncHandler.js";
import User from "../model/userModel.js";
import sendResponse from "../utils/sendResponse.js";
import { generateAccessToken, generateRefreshToken } from "../utils/TokenGenerator.js";
import RefreshToken from "../model/refreshTokenModel.js";
import { generateCsrfToken } from "../utils/csrf.js";


dotenv.config();

export const registerUser = asyncHandler(async function (req, res) {
    const { username, email, password } = req.body
    if (!username || !email || !password){
        res.status(400)
        throw new Error("All fields are mandatory!")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ username, email, password: hashedPassword})
    sendResponse(res, 201, { message: `${req.body.username} created Successfully`})
})


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // 2️⃣ Find user
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 3️⃣ Token payloads
  const accessPayload = {
    userId: user._id,
    email: user.email,
  };

  const refreshPayload = {
    userId: user._id,
  };

  // 4️⃣ Generate tokens
  const accessToken = generateAccessToken(accessPayload);
  const refreshToken = generateRefreshToken(refreshPayload);

  // 5️⃣ Store refresh token in DB
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // 6️⃣ Generate CSRF token
  const csrfToken = generateCsrfToken();

  // 7️⃣ Set cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("csrfToken", csrfToken, {
    httpOnly: false, // must be readable by frontend
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 8️⃣ Send response
  sendResponse(res, 200, {
    message: "Login successful",
    data: {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    },
  });
});



export const refreshToken = asyncHandler(async (req, res) => {
  const oldToken = req.cookies.refreshToken;

  if (!oldToken) {
    res.status(401);
    throw new Error("Refresh token missing");
  }

  // 1️⃣ Find token in DB
  const storedToken = await RefreshToken.findOne({ token: oldToken });

  if (!storedToken) {
    res.status(403);
    throw new Error("Refresh token invalid");
  }

  // 2️⃣ Detect reuse (CRITICAL SECURITY STEP)
  if (storedToken.used) {
    // 🚨 Possible token theft
    await RefreshToken.deleteMany({ user: storedToken.user });

    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");

    res.status(403);
    throw new Error("Token reuse detected. Please login again.");
  }

  // 3️⃣ Verify JWT
  let decoded;
  try {
    decoded = jwt.verify(
      oldToken,
      process.env.REFRESH_TOKEN_SECRET,
      { issuer: "your-app-name" }
    );
  } catch (err) {
    await RefreshToken.deleteOne({ token: oldToken });
    res.status(401);
    throw new Error("Refresh token expired");
  }

  // 4️⃣ Mark old token as used
  storedToken.used = true;
  await storedToken.save();

  // 5️⃣ Generate new tokens
  const newAccessToken = generateAccessToken({
    userId: decoded.userId,
    email: decoded.email,
  });

  const newRefreshToken = generateRefreshToken({
    userId: decoded.userId,
  });

  // 6️⃣ Store new refresh token
  await RefreshToken.create({
    user: decoded.userId,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // 7️⃣ Update cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken: newAccessToken });
});


export const logoutUser = asyncHandler(async function (req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  sendResponse(res, 200, { message: "Logged out successfully" });
});
