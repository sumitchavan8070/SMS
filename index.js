const cors = require("cors");
const express = require("express");
const NodeCache = require("node-cache");
const cron = require("node-cron");
const cache = new NodeCache({ stdTTL: 3600 });
require("dotenv").config();
const pool = require('./sms_api/db');


const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(cachedResponse);
  }

  console.log(`Cache miss for ${key}`);
  res.originalSend = res.send;
  res.send = (body) => {
    cache.set(key, body);
    console.log(`Cache set for ${key}`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.originalSend(body);
  };
  next();
};

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// -------------------------------------------------------------------------------------------------------

const register = require("./sms_api/auth/register");
const login = require("./sms_api/auth/login");




// -------------------------------------------------------------------------------------------------------

app.use("/api/v1/auth/register", cacheMiddleware, register);
app.use("/api/v1/auth/login", cacheMiddleware, login);



// -------------------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the School Management System API</h1>
    <h3>🏫 Your Comprehensive Solution for Educational Administration.</h3>

    <p>This API provides a robust backend for managing various aspects of a school, including user registration, student and parent profiles, and more. It's designed to streamline administrative tasks and provide a centralized system for educational institutions.</p>

    <h2>✨ Key Features:</h2>
    <p>&bull;&emsp;🧑‍🎓 User Registration & Profile Management – for students, parents, and other staff.</p>
    <p>&bull;&emsp;📚 Class and Course Management – organize academic offerings.</p>
    <p>&bull;&emsp;🗓️ Attendance Tracking – monitor student presence.</p>
    <p>&bull;&emsp;📝 Gradebook & Report Card Generation – manage academic performance.</p>
    <p>&bull;&emsp;📧 Communication Tools – facilitate interaction between stakeholders.</p>
    <p>&bull;&emsp;📊 Reporting & Analytics – gain insights into school operations.</p>

    <p>Empower your educational institution with efficient management and seamless operations! 🚀</p>
  `);
});

app.get("/api/clearCache", (req, res) => {
  console.log("Cache cleared successfully");
  cache.flushAll();
  res.send("Cache cleared successfully");
});

cron.schedule("0 */12 * * *", () => {
  console.log("Clearing specific cache keys every 12 hours");
  cache.flushAll();
});

app.listen(3001, () => {
  console.log(`Server is running on http://localhost:${3001}/app/ipo-v1`);
});