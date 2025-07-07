import pool from "./pool.js";
//remember to throw an error for every query functions

export async function createUser(username, password) {
    await pool.query(`INSERT INTO authentication_basics.users(username, password) VALUES ($1, $2);`, [username, password]);
    console.log("User created successfully");
};
export async function retrieveUserByUsername(username) {
    const { rows } = await pool.query(
        `SELECT * FROM authentication_basics.users WHERE username = $1`,
        [username]
    );

    if (rows.length === 0) {
        return false;
    }

    console.log("User retrieved by username successfully!");
    return rows;
}
export async function retrieveUserById(id) {
    const { rows } = await pool.query(`SELECT * FROM authentication_basics.users WHERE id = $1`, [id]);
    
    if (rows.length === 0) {
        throw new Error("User not found");
    }

    console.log("User retrieved by id successfully!");
    return rows;
};