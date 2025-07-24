const express = require("express");
const router = express.Router();
const pool = require("../connection/db");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id; // Get from decoded JWT

  if (!userId) {
    return res.status(400).json({ message: "id is required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT up.*, u.username, u.email, r.name AS role_name
       FROM user_profiles up
       JOIN users u ON up.user_id = u.id
       JOIN roles r ON u.role_id = r.id
       WHERE up.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User profile not found." });
    }

    res.json({
      message: "User profile fetched successfully",
      profile: rows[0],
    });
  } catch (error) {
    console.error("💥 Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
