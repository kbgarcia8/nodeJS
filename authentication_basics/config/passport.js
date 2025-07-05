import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import * as db from "../db/queries.js";

//Configure passport
passport.use(
  new LocalStrategy(async function verify (username, password, done) {
    try {
      const user = await db.retrieveUserByUsername(username);
      const retrievedUser = user[0];
      /*done function in Passport.js is a callback that you must call to complete a step in the Passport flow — whether it's authentication, serialization, or deserialization
      Syntax: done(error, user, info)
        Argument	Meaning
        error	An error object if something failed — pass null if no error occurred
        user	The authenticated (or deserialized) user object, or false if failed
        info	Optional extra info (e.g., "Invalid credentials")
      */
      if (!retrievedUser) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (retrievedUser.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      //
      return done(null, retrievedUser);
    } catch(err) {
      return done(err);
    }
  })
);
/*serializer
Turning a complex object (like a user record) into a simpler format (like an ID or token) that can be stored — typically in a session or cookie.*/
passport.serializeUser((user, done) => {
  done(null, user.id);
});
/*de-serializer
Taking that simple format (like a user ID from the session) and turning it back into the full object (like the full user info from the database).
*/
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.retrieveUserById(id);
    const retrievedUser = user[0];

    done(null, retrievedUser);
  } catch(err) {
    done(err);
  }
});