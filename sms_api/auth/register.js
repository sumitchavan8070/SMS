const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../connection/db"); 

router.post("/", async (req, res) => {
  const {
    username,
    email,
    password,
    role_id,
    full_name,
    gender,
    dob,
    address,
    phone,
    class_id,
    admission_date,
    roll_number,
    guardian_name,
    student_id,
  } = req.body;

  // Basic required fields
  if (!username || !email || !password || !role_id || !full_name || !gender || !dob || !address || !phone) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (isNaN(Number(role_id))) {
    return res.status(400).json({ message: "role_id must be a number." });
  }

  let connection;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      `INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, role_id]
    );

    const newUserId = userResult.insertId;

    await connection.execute(
      `INSERT INTO user_profiles (user_id, full_name, gender, dob, address, phone) VALUES (?, ?, ?, ?, ?, ?)`,
      [newUserId, full_name, gender, dob, address, phone]
    );

    if (Number(role_id) === 5) {
      if (!class_id || !admission_date || !roll_number || !guardian_name) {
        await connection.rollback();
        return res.status(400).json({ message: "Missing student fields." });
      }

      await connection.execute(
        `INSERT INTO students (user_id, class_id, admission_date, roll_number, guardian_name, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [newUserId, class_id, admission_date, roll_number, guardian_name, address, phone]
      );
    }

    if (Number(role_id) === 6) {
      if (!student_id) {
        await connection.rollback();
        return res.status(400).json({ message: "Missing student_id for parent." });
      }

      await connection.execute(
        `INSERT INTO parents (user_id, student_id) VALUES (?, ?)`,
        [newUserId, student_id]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "User registered successfully", userId: newUserId });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Registration error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      const field = error.sqlMessage.includes("username") ? "Username" : "Email";
      return res.status(409).json({ message: `${field} already exists.` });
    }

    res.status(500).json({ message: "Internal server error", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
