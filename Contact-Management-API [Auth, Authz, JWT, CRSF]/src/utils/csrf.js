import crypto from "crypto";

export function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function verifyCsrfToken(cookieToken, headerToken) {
  return (
    cookieToken &&
    headerToken &&
    crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(headerToken)
    )
  );
}