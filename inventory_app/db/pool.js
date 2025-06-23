import dotenv from 'dotenv';
dotenv.config();

import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_DB,
  password: process.env.DATABASE_USER_PASSWORD?.trim(),
  port: Number(process.env.DATABASE_PORT),
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n'), // To properly format multi-line certs
  },
});



 //Connection tester
(async () => {
  try {
    const res = await pool.query("SELECT version()");
    console.log("✅ Connected to database:", res.rows[0].version);
    return
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
  }
})();

export default pool;