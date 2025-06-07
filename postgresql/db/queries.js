import pool from "./pool.js";

export async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM usernames");
  return rows;
}

export async function insertUsername(username) {
  await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
}

export async function searchUsernames(pattern) {
  const result = await pool.query("SELECT * FROM usernames WHERE username LIKE $1", [`%${pattern}%`]);
  //when using LIKE the % or _ must be in the actual string
  return result.rows
}

export async function deleteAllUsernames(){
    await pool.query("TRUNCATE TABLE usernames");
}