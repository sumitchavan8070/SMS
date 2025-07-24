require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const readline = require("readline");

// Function to generate JWT token
const generateToken = (payload, expiresIn = "100h") => {
  const secret = process.env.JWT_SECRET || "your-default-secret";
  const token = jwt.sign(payload, secret, { expiresIn });
  console.log("🪙 Generated JWT Token:", token);
  return token;
};

// Create readline interface to accept user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask for password and process
rl.question("🔑 Enter password: ", async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log("🔒 Hashed Password:", hash);

    generateToken({ password: hash });
  } catch (err) {
    console.error("❌ Error hashing password:", err);
  } finally {
    rl.close();
  }
});
