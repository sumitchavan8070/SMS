// src/config/db.ts or src/database/mysql.config.ts

import { createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

export const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',     // ✅ Fixed
  password: process.env.DB_PASSWORD || '',     // ✅ Fixed
  database: process.env.DB_NAME || 'school_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
