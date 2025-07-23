const jwt = require("jsonwebtoken");

const decodeJwtToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    console.error("JWT decode failed:", error);
    return { valid: false, error: error.message };
  }
};

module.exports = decodeJwtToken;
