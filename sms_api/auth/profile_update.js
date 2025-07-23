const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");

// POST /api/users/update
router.post("/", verifyToken, async (req, res) => {
  const { username, password } = req.body;
  const userId = req.user.id; // Get from decoded JWT

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Check if user exists
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Build update query
    let updateQuery = "UPDATE users SET username = ?";
    const params = [username];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ", password = ?";
      params.push(hashedPassword);
    }

    updateQuery += " WHERE id = ?";
    params.push(userId);

    await connection.execute(updateQuery, params);

    res.json({ message: "User details updated successfully." });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
