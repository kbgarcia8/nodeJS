import { Pool } from "pg";
import pg from "pg";
import { config } from "dotenv";
config();

export default new Pool({
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
/* Connection tester
(async () => {
  try {
    const res = await pool.query("SELECT version()");
    console.log("✅ Connected to database:", res.rows[0].version);
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
  }
})();
*/