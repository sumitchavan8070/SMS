const jwt = require("jsonwebtoken");

const generateToken = (payload, expiresIn = "2h") => {
  const secret = process.env.JWT_SECRET;

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = {
  generateToken
};