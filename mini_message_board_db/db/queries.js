import pool from "./pool.js";

export async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
}

export async function insertUsername(username) {
  await pool.query("INSERT INTO users (username, email) VALUES ($1)", [username]);
}

export async function searchUsernames(pattern) {
  const result = await pool.query("SELECT * FROM users WHERE username LIKE $1", [`%${pattern}%`]);
  //when using LIKE the % or _ must be in the actual string
  return result.rows
}

export async function getAllData() {
  const result = await pool.query(`
      SELECT users.id AS user_id, messages.id AS message_id, users.username AS user, users.email AS email, messages.message AS message, messages.dateandtime AS time
      FROM users
      INNER JOIN messages
      ON users.id = messages.user_id;
  `)
  return result.rows
}

export async function deleteAllData(){
    await pool.query(`
      TRUNCATE TABLE users;
      TRUNCATE TABLE messages;
    `);
    await pool.query("");
}