import pool from "./pool.js";
import { DBError } from "../utils/errors.js";
//remember to throw an error for every query functions
/* Substitute err.detail for all function with a message since err.detail is not native/pre-determined*/

//Messages
export async function retrieveAllMessages() {
    try{
        const { rows } = await pool.query(`
            SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id;
        `);

        return rows;
    } catch(err) {
        console.error("Database error in retrieveAllMessages:", err);
        throw new DBError("Failed to retrieve all messages in database", 409, "DB_RETRIEVE_ALL_MESSAGES_FAILED", {
            detail: err.detail,
        });
    }
};
export async function retrieveMessagesBelongToUser(userId) {
    try{
        const { rows } = await pool.query(`
            SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id WHERE u.id = $1;
        `,[userId]);

        return rows;
    } catch(err) {
        console.error("Database error in retrieveMessagesBelongToUser:", err);
        throw new DBError(`Failed to retrieve all messages in database belonging to user ${rows[0].username}`, 409, "DB_RETRIEVE_USER_MESSAGES_FAILED", {
            detail: err.detail,
        });
    }
};
export async function retrieveMatchMessages(searchMessagePattern, searchSenderPattern) {
    try {
        if(searchMessagePattern && !searchSenderPattern){
            const { rows } = await pool.query(`
            SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id
            WHERE m.message ILIKE $1;
            `, [`%${searchMessagePattern}%`]);
            console.log(`Mathced Search Pattern: ${rows}`);
            return rows;
        } else if(!searchMessagePattern && searchSenderPattern){
            const { rows } = await pool.query(`
            SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id
            WHERE u.username ILIKE $1;  
            `, [`%${searchSenderPattern}%`]);
            console.log(`Mathced Message with specified User: ${rows}`);
            return rows;
        } else if(searchMessagePattern && searchSenderPattern){
            const { rows } = await pool.query(`
            SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id
            WHERE m.message ILIKE $1 AND u.username ILIKE $2;   
            `, [`%${searchMessagePattern}%`,`%${searchSenderPattern}%`]);
            console.log(`Mathced Search Pattern and Message with specified User: ${rows}`);
            return rows;
        }
    } catch (err) {
        console.error("Database error in retrieveMatchMessages:", err);
        throw new DBError(`Failed to retrieve searched messages in database`, 409, "DB_RETRIEVE_MATCH_MESSAGES_FAILED", {
            detail: err.detail,
        });
    }
};
export async function insertNewMessage(userId, messageTitle, messageText) {
    try{
        await pool.query(`INSERT INTO members_only.messages(user_id, title, message) VALUES ($1, $2, $3)`,[userId, messageTitle, messageText]);
        console.log(`Message successfully added for user ${userId}`);
    }catch(err){
        console.error("Database error in insertNewMessage:", err)
        throw new DBError(`Failed to add new message under user ${userId}`, 400, "DB_INSERT_MESSAGE_ERROR",{
            details: err.detail
        });
    }
};
//User
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
        const { rows } = await pool.query(`SELECT * FROM members_only.users AS u JOIN members_only.membership AS m ON u.id = m.user_id WHERE u.email = $1`, [email]);
        
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
            `SELECT * FROM members_only.users AS u JOIN members_only.membership AS m ON u.id = m.user_id WHERE u.id = $1`,[id]
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

export async function addDefaultMembership(userId, membershipCode){
    try{
        //check first if user's membership is existent
        const { rows } = await pool.query(
            `SELECT * FROM members_only.membership WHERE user_id = $1`,[userId]
        );

        console.log(rows.length, userId)

        if (rows.length === 0 && membershipCode === false) { //If user does not exist in membership table and did not submit correct secret membership code then add default membership
            await pool.query(`INSERT INTO members_only.membership(user_id, status_code) VALUES ($1, 2);`, [userId]);
            console.log("Default membership (Guest) successfully added to new user!");
        } else if (rows.length === 0 && membershipCode === true) { //If user does not exist in membership table and submit correct secret membership code then add default membership
            await pool.query(`INSERT INTO members_only.membership(user_id, status_code) VALUES ($1, 3);`, [userId]);
            console.log("Secret Code correct. Membership (Member) successfully added to new user!");
        } else if (rows.length > 0){ //If user does exist in membership table then update membership
            console.error("Database error in addDefaultMembership:", err);
            throw new DBError(`Failed to add default membership for user existing user with id ${userId}!`, 409, "DB_ADD_MEMBERSHIP_FOR_EXISTING_USER_FAILED", {
                detail: "If user is exising must execute modifyMembership instead!"
            });
        }

    } catch(err){
        console.error("Database error in addDefaultMembership:", err);
        throw new DBError(`Failed to add membership for new user with id ${userId}`, 409, "DB_ADD_MEMBERSHIP_FOR_NEW_USER_FAILED", {
            detail: err.detail,
        });
    }
};

export async function modifyMembership(userId, code){
    try{
        //check first if user's membership is existent
        const { rows } = await pool.query(
            `SELECT * FROM members_only.membership WHERE user_id = $1`,[userId]
        );

        if (rows.length === 0) { //If user does not exist in membership table
            console.error("Database error in modifyMembership:", err);
            throw new DBError(`Failed to modify membership for user with id ${userId}!`, 409, "DB_MODIFY_MEMBERSHIP_FAILED_USER_DOES_NOT_EXIST", {
                detail: "If user does not exist, please register first!",
            });
        } else if (rows.length > 0){ //If user does exist in membership table then update membership
            await pool.query(`UPDATE members_only.membership
            SET status_code = $2
            WHERE user_id = $1;`, [userId, code]);
        }

    } catch(err){
        console.error("Database error in modifyMembership:", err);
        throw new DBError(`Failed to modify membership for user with id ${userId}`, 409, "DB_MODIFY_MEMBERSHIP_FAILED", {
            detail: err.detail,
        });
    }
};

