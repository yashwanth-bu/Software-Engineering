import jwt from "jsonwebtoken";

export function generateAccessToken({ userId, email }){
    return jwt.sign(
        { userId, email }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "10m", issuer: "your-app-name" }
    );
}

export function generateRefreshToken({ userId }) {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d", issuer: "your-app-name" }
  );
}