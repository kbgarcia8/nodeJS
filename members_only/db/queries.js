import pool from "./pool.js";
import { DBError } from "../utils/errors.js";
//remember to throw an error for every query functions
/* Substitute err.error || err.message for all function with a message since err.error || err.message is not native/pre-determined*/

//Messages
export async function retrieveAllMessages() {
    try{
        const { rows } = await pool.query(`
            SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.id AS message_id, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted, m.created_at AT TIME ZONE 'UTC' AS created_at_utc FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id;
        `);

        return rows;
    } catch(err) {
        console.error("Database error in retrieveAllMessages:", err);
        throw new DBError("Failed to retrieve all messages in database", 409, "DB_RETRIEVE_ALL_MESSAGES_FAILED", {
            detail: err.error || err.message,
        });
    }
};
export async function retrieveMessagesBelongToUser(userId) {
    try{
        const { rows } = await pool.query(`
            SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.id AS message_id, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted, m.created_at AT TIME ZONE 'UTC' AS created_at_utc FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id WHERE u.id = $1;
        `,[userId]);

        return rows;
    } catch(err) {
        console.error("Database error in retrieveMessagesBelongToUser:", err);
        throw new DBError(`Failed to retrieve all messages in database belonging to user ${rows[0].username}`, 409, "DB_RETRIEVE_USER_MESSAGES_FAILED", {
            detail: err.error || err.message,
        });
    }
};
export async function retrieveMatchMessages(searchMessagePattern, searchSenderPattern, searchTitlePattern) {
    const query = `SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.id AS message_id, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted, m.created_at AT TIME ZONE 'UTC' AS created_at_utc FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id`;

    const conditions = [];
    const values = [];
    let index = 1;

    if (searchMessagePattern) {
        conditions.push(`m.message ILIKE $${index++}`);
        values.push(`%${searchMessagePattern}%`);
    }

    if (searchSenderPattern) {
        conditions.push(`u.username ILIKE $${index++}`);
        values.push(`%${searchSenderPattern}%`);
    }

    if (searchTitlePattern) {
        conditions.push(`m.title ILIKE $${index++}`);
        values.push(`%${searchTitlePattern}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const finalQuery = `${query} ${whereClause};`;

    try {
        const { rows } = await pool.query(finalQuery, values);
        console.log("Message search returned matches successfully!");
        return rows;

    } catch (err) {
        console.error("Database error in retrieveMatchMessages:", err);
        throw new DBError(`Failed to retrieve searched messages in database`, 409, "DB_RETRIEVE_MATCH_MESSAGES_FAILED", {
            detail: err.error || err.message,
        });
    }
};
export async function retrieveMessageById(messageId){
    try{
        const { rows } = await pool.query(`
            SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, m.id AS message_id, m.title, m.message, TO_CHAR(m.created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted, m.created_at AT TIME ZONE 'UTC' AS created_at_utc FROM members_only.users AS u JOIN members_only.messages AS m ON u.id = m.user_id WHERE m.id = $1;
        `,[messageId]);

        console.log(`Message ${messageId} retrieved successfully`);
        return rows[0];
    } catch(err) {
        console.error("Database error in retrieveMessageById:", err);
        throw new DBError(`Failed to retrieve messages in database with message ID ${messageId}`, 409, "DB_RETRIEVE_MESSAGE_BY_ID_FAILED", {
            detail: err.error || err.message,
        });
    }
}
export async function insertNewMessage(userId, messageTitle, messageText) {
    try{
        await pool.query(`INSERT INTO members_only.messages(user_id, title, message) VALUES ($1, $2, $3)`,[userId, messageTitle, messageText]);
        console.log(`Message successfully added for user ${userId}`);
    }catch(err){
        console.error("Database error in insertNewMessage:", err)
        throw new DBError(`Failed to add new message under user ${userId}`, 400, "DB_INSERT_MESSAGE_ERROR",{
            details: err.error || err.message
        });
    }
};
export async function deleteMessage(messageId) {
    try {
        await pool.query(`
            DELETE FROM members_only.messages
            WHERE id = $1;
        `, [messageId]);
        const user = await pool.query(`
            SELECT user_id FROM members_only.messages WHERE id = $1;`, [messageId]);
        //console.log(`Successfully deleted message id: ${messageId} from user: ${user[0].user_id}`);
    }  catch(err) {
        console.error("Database error in deleteMessage:", err)
        throw new DBError(`Failed to delete message under user ${user[0].user_id}`, 400, "DB_DELETE_MESSAGE_ERROR", {
            details: err.error || err.message
        });
    }
};
export async function updateMessage(messageId, editMessageTitle, editmessageText) {
    try{
        await pool.query(`UPDATE members_only.messages SET title = $2, message = $3 WHERE id = $1;`,[messageId, editMessageTitle, editmessageText]);
        console.log(`Message with message ID: ${messageId} was succesfully edited!`);
    }catch(err){
        console.error("Database error in updateMessage:", err)
        throw new DBError(`Failed to edit message with ID ${messageId}`, 400, "DB_UPDATE_MESSAGE_ERROR",{
            details: err.error || err.message
        });
    }
};
//User
export async function retrieveAllUsers() {
    try{
        const {rows} = await pool.query(`SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, TO_CHAR(u .created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted, m.status_code AS membership FROM members_only.users AS u JOIN members_only.membership AS m ON u.id = m.user_id;`);
        console.log("All Users information retrieved successfully");
        return rows;
    } catch(err) {
        console.error("Database error in retrieveAllUsers:", err);
        throw new DBError("Failed to retrieve all users in database", 409, "DB_RETRIEVE_ALL_USER_FAILED", {
            detail: err.error || err.message,
        });
    }
}
export async function retrieveMatchUsers(searchUsername, searchFirstName, searchLastName, searchUserEmail) {
    const query = `SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, TO_CHAR(u .created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted, m.status_code AS membership FROM members_only.users AS u JOIN members_only.membership AS m ON u.id = m.user_id`;

    const conditions = [];
    const values = [];
    let index = 1;

    if (searchUsername) {
        conditions.push(`u.username ILIKE $${index++}`);
        values.push(`%${searchUsername}%`);
    }

    if (searchFirstName) {
        conditions.push(`u.first_name ILIKE $${index++}`);
        values.push(`%${searchFirstName}%`);
    }

    if (searchLastName) {
        conditions.push(`u.last_name ILIKE $${index++}`);
        values.push(`%${searchLastName}%`);
    }

    if (searchUserEmail) {
        conditions.push(`u.email ILIKE $${index++}`);
        values.push(`%${searchUserEmail}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const finalQuery = `${query} ${whereClause};`;

    try {
        const { rows } = await pool.query(finalQuery, values);
        console.log("Message search returned matches successfully!");
        return rows;

    } catch (err) {
        console.error("Database error in retrieveMatchUsers:", err);
        throw new DBError(`Failed to retrieve searched users in database`, 409, "DB_RETRIEVE_MATCH_USERS_FAILED", {
            detail: err.error || err.message,
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
            detail: err.error || err.message,
        });
    }
};
export async function updateUser(userId, firstName, lastName, username, email) {
    try{
        await pool.query(`UPDATE members_only.users SET first_name = $2, last_name = $3, username = $4, email = $5 WHERE id = $1;`, [userId, firstName, lastName, username, email]);
        console.log("User updated successfully");
    } catch(err) {
        console.error("Database error in updateUser:", err);
        throw new DBError("Failed to update user in database", 409, "DB_UPDATE_USER_FAILED", {
            detail: err.error || err.message,
        });
    }
};
export async function deleteUser(userId) {
    try{
        await pool.query(`DELETE FROM members_only.users WHERE id = $1;`, [userId]);
        console.log("User deleted successfully");
    } catch(err) {
        console.error("Database error in deleteUser:", err);
        throw new DBError("Failed to delete user in database", 409, "DB_DELETE_USER_FAILED", {
            detail: err.error || err.message,
        });
    }
};
export async function retrieveNewlyCreatedUser(email) {
    try{
        const { rows } = await pool.query(`SELECT * FROM members_only.users AS u WHERE u.email = $1`, [email]);
        
        if (rows.length === 0) {
            throw new DBError("User email not found", 409, "DB_USER_EMAIL_NOT_FOUND", {
                detail: `No user found with email: ${email}`
            });
        }

        console.log("Mewly created user retrieved by email successfully!");
        return rows[0]; //since a single user is expected
    } catch(err) {
        console.error("Database error in retrieveNewlyCreatedUser:", err);
        throw new DBError("Failed to retrieve newly created user by email", 409, "DB_USER_EMAIL_NOT_FOUND", {
            detail: err.error || err.message,
        });
    }
};
export async function retrieveUserByEmail(email) {
    try{
        const { rows } = await pool.query(`SELECT u.id AS user_id, u.first_name, u.last_name, u.username, u.email, u.password, TO_CHAR(u .created_at, 'MM-DD-YYYY HH24:MI') AS created_at_formatted, m.status_code AS membership FROM members_only.users AS u JOIN members_only.membership AS m ON u.id = m.user_id WHERE u.email = $1`, [email]);
        
        if (rows.length === 0) {
            throw new DBError("User email not found", 409, "DB_USER_EMAIL_NOT_FOUND", {
                detail: `No user found with email: ${email}`
            });
        }

        console.log("User retrieved by email successfully!");
        console.log(rows[0])
        return rows[0]; //since a single user is expected
    } catch(err) {
        console.error("Database error in retrieveUserByEmail:", err);
        throw new DBError("Failed to retrieve user by email", 409, "DB_USER_EMAIL_NOT_FOUND", {
            detail: err.error || err.message,
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
            detail: err.error || err.message,
        });
    }
};
export async function addDefaultMembership(userId, membershipCode){
    try{
        //check first if user's membership is existent
        const { rows } = await pool.query(
            `SELECT * FROM members_only.membership WHERE user_id = $1`,[userId]
        );

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
            detail: err.error || err.message,
        });
    }
};
export async function addMembershipToCreatedUser(userId, membershipCode){
    try{
        //check first if user's membership is existent
        const { rows } = await pool.query(
            `SELECT * FROM members_only.membership WHERE user_id = $1`,[userId]
        );

        if (rows.length === 0) { //If user does not exist in membership table
            await pool.query(`INSERT INTO members_only.membership(user_id, status_code) VALUES ($1, $2);`, [userId, membershipCode]);
            console.log(` successfully added to new user!`);
        } else if (rows.length > 0){ //If user does exist in membership table then update membership
             throw new DBError(`Failed to add default membership for user existing user with id ${userId}!`, 409, "DB_ADD_MEMBERSHIP_FOR_EXISTING_USER_FAILED", {
                detail: "If user is exising must execute modifyMembership instead!"}
            );
        }

    } catch(err){
        console.error("Database error in addMembershipToCreatedUser:", err);
        throw new DBError(`Failed to add membership for created user with id ${userId}`, 409, "DB_ADD_MEMBERSHIP_FOR_CREATE_USER_FAILED", {
            detail: err.error || err.message,
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
                detail: "If user does not exist, please register first or have an admin create it!",
            });
        } else if (rows.length > 0){ //If user does exist in membership table then update membership
            await pool.query(`UPDATE members_only.membership
            SET status_code = $2
            WHERE user_id = $1;`, [userId, code]);
        }

    } catch(err){
        console.error("Database error in modifyMembership:", err);
        throw new DBError(`Failed to modify membership for user with id ${userId}`, 409, "DB_MODIFY_MEMBERSHIP_FAILED", {
            detail: err.error || err.message,
        });
    }
};

