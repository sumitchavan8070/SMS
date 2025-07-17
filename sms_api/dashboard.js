// routes/dashboard.js
const express = require("express");
const router = express.Router();
const verifyToken = require("./middleware/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  // You now have access to req.user
  res.json({
    message: "Welcome to the dashboard!",
    user: req.user,
  });
});

module.exports = router;
