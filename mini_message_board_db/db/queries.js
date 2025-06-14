import pool from "./pool.js";

export async function getAllData() {
  const { rows } = await pool.query(`
      SELECT users.id AS user_id, messages.id AS message_id, users.username AS user, users.email AS email, messages.message AS message, messages.dateandtime AS time
      FROM users
      INNER JOIN messages
      ON users.id = messages.user_id;
  `)
  return rows;
}

export async function deleteAllData(){
    await pool.query(`
      TRUNCATE TABLE users;
      TRUNCATE TABLE messages;
    `);
}

export async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
}

export async function insertUser(username, email) {
  await pool.query("INSERT INTO users (username, email) VALUES ($1, $2)", [username, email]);
}

export async function searchUserToUpdate(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE users.id = $1", [id]);
  //when using LIKE the % or _ must be in the actual string
  return rows[0];
}

export async function updateUser(username,email,id){
  const { rows } = await pool.query("UPDATE users SET email = $1,  username = $2 WHERE id = $3", [email, username, id]);
  //console.log(rows[0]);
}

export async function searchUsernames(searchUsername, searchUserEmail) {
  if(searchUsername && !searchUserEmail){
    const { rows } = await pool.query("SELECT * FROM users WHERE username ILIKE $1", [`%${searchUsername}%`]);
    console.log(`Mathced Username: ${rows}`);
    return rows 
  } else if(!searchUsername && searchUserEmail){
    const { rows } = await pool.query("SELECT * FROM users WHERE email ILIKE $1", [`%${searchUserEmail}%`]);
    console.log(`Mathced User Email: ${rows}`);
    return rows
  } else if(searchUsername && searchUserEmail){
    const { rows } = await pool.query("SELECT * FROM users WHERE username ILIKE $1 AND email ILIKE $2", [`%${searchUsername}%`,`%${searchUserEmail}%`]);
    console.log(`Mathced Username and User Email: ${rows}`);
    return rows
  }
}

export async function deleteUsername(id) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}

export async function insertMessage(id, message) {
  await pool.query("INSERT INTO messages (user_id, message) VALUES ($1, $2)", [id, message]);
}
