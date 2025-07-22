const express = require("express");
const router = express.Router();
const { verifyRefreshToken, generateToken } = require("../utils/jwt");
const pool = require("../db");

router.post("/", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const connection = await pool.getConnection();

    const [users] = await connection.execute(
      `SELECT u.id, u.username, u.email, u.role_id, p.full_name 
       FROM users u
       JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [decoded.userId]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ message: "User not found." });
    }

    const user = users[0];

    const newAccessToken = generateToken({
      userId: user.id,
      roleId: user.role_id,
      email: user.email,
      username: user.username,
    });

    res.json({
      message: "Token refreshed successfully",
      token: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid or expired refresh token." });
  }
});

module.exports = router;
