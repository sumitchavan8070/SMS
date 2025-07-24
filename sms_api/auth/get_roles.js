const express = require("express");
const router = express.Router();
const pool = require("../connection/db");

// const verifyToken = require("../middleware/verifyToken");

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const [roles] = await connection.execute("SELECT * FROM roles");

    res.json({
      satatus: 1,
      message: "Roles fetched successfully",
      roles,
    });
  } catch (error) {
    console.error("💥 Error fetching roles:", error);
    res.status(500).json({
      satatus: 0,
      message: "Internal server error",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
