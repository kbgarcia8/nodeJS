import pool from "./pool.js";
import { DBError } from "../utils/errors.js";
//remember to throw an error for every query functions

export async function retrieveAllMessage() {
    try{
        const { rows } = await pool.query(`
            SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id;
        `);

        return rows;
    } catch(err) {
        console.error("Database error in retrieveAllMessage:", err);
        throw new DBError("Failed to retrieve all messages in database", 409, "DB_RETRIEVE_ALL_MESSAGE_FAILED", {
            detail: err.detail,
        });
    }
};

export async function createUser(firstName, lastName, username, email, password) {
    try{
        await pool.query(`INSERT INTO members_only.users(first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5);`, [firstName, lastName, username, email, password]);
        console.log("User created successfully");
    } catch(err) {
        console.error("Database error in createUser:", err);
        throw new DBError("Failed to create user in database", 409, "DB_CREATE_USER_FAILED", {
            detail: err.detail,
        });
    }
};

export async function retrieveUserByEmail(email) {
    try{
        const { rows } = await pool.query(`SELECT * FROM members_only.users WHERE email = $1`, [email]);
        
        if (rows.length === 0) {
            throw new DBError("User email not found", 409, "DB_USER_EMAIL_NOT_FOUND", {
                detail: `No user found with email: ${email}`
            });
        }

        console.log("User retrieved by email successfully!");
        return rows[0]; //since a single user is expected
    } catch(err) {
        console.error("Database error in retrieveUserByEmail:", err);
        throw new DBError("Failed to retrieve user by email", 409, "DB_USER_EMAIL_NOT_FOUND", {
            detail: err.detail,
        });
    }
};

export async function retrieveUserById(id) {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM members_only.users WHERE id = $1`,[id]
        );

        if (rows.length === 0) {
            throw new DBError("User id not found", 409, "DB_USER_ID_NOT_FOUND", {
                detail: `No user found with id: ${id}`
            });
        }

        console.log("User retrieved by id successfully!");
        return rows[0]; //since a single user is expected
    } catch(err) {
        console.error("Database error in retrieveUserById:", err);
        throw new DBError("Failed to retrieve user by id", 409, "DB_USER_ID_NOT_FOUND", {
            detail: err.detail,
        });
    }
};
