const express = require("express");
const router = express.Router();
const pool = require("../connection/db");

// Optional: Add verifyToken if the route should be protected
// const verifyToken = require("../middleware/verifyToken");

router.get("/", async (req, res) => {
  const { userId } = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [parents] = await connection.execute(
      `SELECT p.*, up.full_name, up.phone, u.username, u.email
       FROM parents p
       JOIN user_profiles up ON p.user_id = up.user_id
       JOIN users u ON p.user_id = u.id
       WHERE p.userId = ?`,
      [userId]
    );

    if (parents.length === 0) {
      return res.status(404).json({ message: "No parents found for this student." });
    }

    res.json({
      message: "Parents fetched successfully",
      parents,
    });
  } catch (error) {
    console.error("💥 Error fetching parents:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
