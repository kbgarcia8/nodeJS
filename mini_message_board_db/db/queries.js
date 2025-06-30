import pool from "./pool.js";

export async function getAllData() {
  const { rows } = await pool.query(`
      SELECT message_board.users.id AS user_id, message_board.messages.id AS message_id, message_board.users.username AS user, message_board.users.email AS email, message_board.messages.message AS message, message_board.messages.dateandtime AS time
      FROM message_board.users
      INNER JOIN message_board.messages
      ON message_board.users.id = message_board.messages.user_id;
  `)
  return rows;
}

export async function getAllMessages() {
  const { rows } = await pool.query(`SELECT * FROM message_board.messages;`)
  return rows;
}

export async function deleteAllData(){
    await pool.query(`
      TRUNCATE TABLE message_board.users, message_board.messages RESTART IDENTITY CASCADE;
    `);
    //RESTART IDENTITY resets auto-increment values (SERIAL or BIGSERIAL)
}

export async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM message_board.users");
  return rows;
}

export async function insertUser(username, email) {
  await pool.query("INSERT INTO message_board.users (username, email) VALUES ($1, $2)", [username, email]);
}

export async function searchUserToUpdate(id) {
  const { rows } = await pool.query("SELECT * FROM message_board.users WHERE message_board.users.id = $1", [id]);
  return rows[0];
}

export async function updateUser(username,email,id){
  const { rows } = await pool.query("UPDATE message_board.users SET email = $1,  username = $2 WHERE id = $3", [email, username, id]);
  //console.log(rows[0]);
}

export async function searchUsernames(searchUsername, searchUserEmail) {
  if(searchUsername && !searchUserEmail){
    const { rows } = await pool.query("SELECT * FROM message_board.users WHERE username ILIKE $1", [`%${searchUsername}%`]);
    //when using LIKE the % or _ must be in the actual string
    console.log(`Mathced Username: ${rows}`);
    return rows 
  } else if(!searchUsername && searchUserEmail){
    const { rows } = await pool.query("SELECT * FROM message_board.users WHERE email ILIKE $1", [`%${searchUserEmail}%`]);
    console.log(`Mathced User Email: ${rows}`);
    return rows
  } else if(searchUsername && searchUserEmail){
    const { rows } = await pool.query("SELECT * FROM message_board.users WHERE username ILIKE $1 AND email ILIKE $2", [`%${searchUsername}%`,`%${searchUserEmail}%`]);
    console.log(`Mathced Username and User Email: ${rows}`);
    return rows
  }
}

export async function deleteUsername(id) {
  await pool.query("DELETE FROM message_board.users WHERE id = $1", [id]);
}

export async function insertMessage(id, message) {
  await pool.query("INSERT INTO message_board.messages (user_id, message) VALUES ($1, $2)", [id, message]);
}

export async function searchMessages(searchPattern, searchSender) {
  if(searchPattern && !searchSender){
    const { rows } = await pool.query(`
      SELECT message_board.users.id AS user_id, message_board.messages.id AS message_id, message_board.users.username AS user, message_board.users.email AS email, message_board.messages.message AS message, message_board.messages.dateandtime AS time
      FROM message_board.users
      INNER JOIN message_board.messages
      ON message_board.users.id = message_board.messages.user_id
      WHERE message_board.messages.message ILIKE $1;  
    `, [`%${searchPattern}%`]);
    console.log(`Mathced Search Pattern: ${rows}`);
    return rows;
  } else if(!searchPattern && searchSender){
    const { rows } = await pool.query(`
      SELECT message_board.users.id AS user_id, message_board.messages.id AS message_id, message_board.users.username AS user, message_board.users.email AS email, message_board.messages.message AS message, message_board.messages.dateandtime AS time
      FROM message_board.users
      INNER JOIN message_board.messages
      ON message_board.users.id = message_board.messages.user_id
      WHERE message_board.users.username ILIKE $1;  
    `, [`%${searchSender}%`]);
    console.log(`Mathced Message with specified User: ${rows}`);
    return rows;
  } else if(searchPattern && searchSender){
    const { rows } = await pool.query(`
      SELECT message_board.users.id AS user_id, message_board.messages.id AS message_id, message_board.users.username AS user, message_board.users.email AS email, message_board.messages.message AS message, message_board.messages.dateandtime AS time
      FROM message_board.users
      INNER JOIN message_board.messages
      ON message_board.users.id = message_board.messages.user_id
      WHERE message_board.messages.message ILIKE $1 AND message_board.users.username ILIKE $2;   
    `, [`%${searchPattern}%`,`%${searchSender}%`]);
    console.log(`Mathced Search Pattern and Message with specified User: ${rows}`);
    return rows;
  }
};

export async function viewMessage(id){
  console.log(id)
  const { rows } = await pool.query(`
      SELECT message_board.users.id AS user_id, message_board.messages.id AS message_id, message_board.users.username AS user, message_board.users.email AS email, message_board.messages.message AS message, message_board.messages.dateandtime AS time
      FROM message_board.users
      INNER JOIN message_board.messages ON message_board.users.id = message_board.messages.user_id
      WHERE message_board.messages.id = $1;  
    `,[id]);
    console.log(rows)
  return rows[0];
}

export async function deleteMessage(id) {
  await pool.query("DELETE FROM message_board.messages WHERE id = $1", [id]);
};