const express = require("express");
const router = express.Router();
const pool = require("../connection/db");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  console.warn("🔐 WARNING: Password check is being bypassed for this route!");

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [users] = await connection.execute(
      `SELECT u.id, u.username, u.email, u.password, u.role_id, p.full_name 
   FROM users u
   JOIN user_profiles p ON u.id = p.user_id
   WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      console.log("❌ No user found for this email.");
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = users[0];
    console.log("✅ User found:", user.email);

    const userHashedPassword = user.password;
    const match = await bcrypt.compare(password, userHashedPassword);

    if (!match) {
      console.log("❌ Passwords do not match.");
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const tokenPayload = {
      userId: user.id,
      roleId: user.role_id,
      email: user.email,
      username: user.username,
    };

    const token = generateToken(tokenPayload);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
