// middleware/verifyToken.js
const jwt = require("jsonwebtoken");
const pool = require("../db");

// bcrypt.hash('123456', 10).then(hash => {
//   console.log(hash); // copy this hash
// });

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      `SELECT u.id, u.username, u.email, u.role_id 
       FROM users u 
       WHERE u.id = ? AND u.email = ?`,
      [decoded.userId, decoded.email]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = users[0]; // Attach user to request for future use
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Unauthorized User" });
  }
};

module.exports = verifyToken;
