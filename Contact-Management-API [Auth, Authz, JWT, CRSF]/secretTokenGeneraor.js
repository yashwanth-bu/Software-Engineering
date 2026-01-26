import crypto from "crypto";

// Generate 64-byte (512-bit) secret, hex-encoded
const accessTokenSecret = crypto.randomBytes(64).toString("hex");
const refreshTokenSecret = crypto.randomBytes(64).toString("hex");

console.log("Access Token Secret:", accessTokenSecret);
console.log("Refresh Token Secret:", refreshTokenSecret);
