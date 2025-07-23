// debug-password.js
const bcrypt = require("bcrypt");
const pool = require("./sms_api/db"); // Import the connection pool from your db.js file

async function debugPasswordCheck() {
  // === CONFIGURATION ===
  // 1. Enter the email of the user you are trying to log in as
  const userEmail = "principal@example.com";

  // 2. Enter the plaintext password you are using for the login attempt
  const plaintextPassword = "1234567";
  // =====================

  let connection;
  try {
    // Get a connection from the pool you defined in db.js
    connection = await pool.getConnection();
    console.log("🔗 Database connection established for debugging");

    // Retrieve the user's details, including the hashed password
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

    // Use bcrypt.compare to safely check the password
    const match = await bcrypt.compare(plaintextPassword, userHashedPassword);

    if (match) {
      console.log("✅ SUCCESS: The plaintext password MATCHES the stored hash.");
      console.log("This means the login failure is NOT due to a password mismatch.");
    } else {
      console.log("❌ FAILURE: The plaintext password DOES NOT match the stored hash.");
      console.log("This means the password stored in the database is incorrect for this user.");
    }
  } catch (error) {
    console.error("💥 An error occurred during debugging:", error);
  } finally {
    if (connection) {
      // Release the connection back to the pool
      connection.release();
      console.log("🔌 DB connection released");
    }
  }
}

debugPasswordCheck();