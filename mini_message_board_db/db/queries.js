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
    await pool.query("");
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
  console.log(rows[0]);
}

export async function searchUsernames(searchUsername, searchUserEmail) {
  if(searchUsername && !searchUserEmail){
    const { rows } = await pool.query("SELECT * FROM users WHERE username LIKE $1", [`%${searchUsername}%`]);    
  } else if(!searchUsername && searchUserEmail){
    const { rows } = await pool.query("SELECT * FROM users WHERE email LIKE $1", [`%${searchUserEmail}%`]);
  } else if(searchUsername && searchUserEmail){
    const { rows } = await pool.query("SELECT * FROM users WHERE username LIKE $1 AND email LIKE $2", [`%${searchUsername}%`,`%${searchUserEmail}%`]);
  }
  return rows
}
