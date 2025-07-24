const jwt = require("jsonwebtoken");

const generateToken = (payload, expiresIn = "100h") => {
  const secret = process.env.JWT_SECRET;

  const hashPass = jwt.sign(payload, secret, { expiresIn });
  console.log("hash pass", hashPass);

  return hashPass;
};

module.exports = {
  generateToken
};