// debug-password.js
const bcrypt = require("bcrypt");
const pool = require("./sms_api/connection/db"); // Import the connection pool from your db.js file

async function debugPasswordCheck() {
  const userEmail = "principal@example.com";
  const plaintextPassword = "Sumit@#123";

  // 👉 Hash any test password you want here:
  const testPassword = "123456";
  const testHash = await bcrypt.hash(testPassword, 10);
  console.log("🔐 Hash for '123456':", testHash);

  let connection;
  try {
    connection = await pool.getConnection();
    console.log("🔗 Database connection established for debugging");

    const [users] = await connection.execute(
      `SELECT password FROM users WHERE email = ?`,
      [userEmail]
    );

    if (users.length === 0) {
      console.log(`❌ No user found with email: ${userEmail}`);
      return;
    }

    const userHashedPassword = users[0].password;

    console.log("=======================================");
    console.log("🔎 Debugging Password Check");
    console.log(`User Email:           ${userEmail}`);
    console.log(`Input Password:       ${plaintextPassword}`);
    console.log(`Database Hashed PW:   ${userHashedPassword}`);
    console.log("=======================================");

    const match = await bcrypt.compare(plaintextPassword, userHashedPassword);

    if (match) {
      console.log("✅ SUCCESS: The plaintext password MATCHES the stored hash.");
    } else {
      console.log("❌ FAILURE: The plaintext password DOES NOT match the stored hash.");
    }
  } catch (error) {
    console.error("💥 An error occurred during debugging:", error);
  } finally {
    if (connection) {
      connection.release();
      console.log("🔌 DB connection released");
    }
  }
}


debugPasswordCheck();