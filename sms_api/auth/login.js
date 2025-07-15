const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../db");
const { generateToken } = require("../utils/jwt");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

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
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken({
      userId: user.id,
      roleId: user.role_id,
      email: user.email,
      username: user.username,
    });

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
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
