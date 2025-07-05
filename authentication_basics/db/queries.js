import pool from "./pool.js";

export async function createUser(username, password){
    await pool.query(`INSERT INTO authentication_basics.users(username, password) VALUES ($1, $2);`, [username, password]);
    console.log("User created successfully");
};

export async function retrieveUserByUsername(username){
    const { rows } = await pool.query(`SELECT * FROM authentication_basics.users WHERE username = $1`, [username]);
    console.log("User retrieved by username successfully!");
    return rows;
};
export async function retrieveUserById(id){
    const { rows } = await pool.query(`SELECT * FROM authentication_basics.users WHERE id = $1`, [id]);
    console.log("User retrieved by id successfully!");
    return rows;
};