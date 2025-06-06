import pool from './db/pool.js';
import * as db from "./db/queries.js";

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL!');
    console.log('Current time from DB:', res.rows[0]);
    await pool.end(); // Close the connection pool
  } catch (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
  }
}

//testConnection();
 async function getUsernames() {
  const usernames = await db.getAllUsernames();
  console.log("Usernames: ", usernames);
}

getUsernames()