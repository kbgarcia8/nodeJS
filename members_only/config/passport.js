import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import * as db from "../db/queries.js";
import bcrypt from "bcryptjs";

//Configure passport
passport.use(
  new LocalStrategy({
  usernameField: 'login-email', // match the name attribute in your form and is read in req.body
  passwordField: 'login-password'
},  async function verify (email, password, done) { //takes up the values in LocalStrategy Object in order as argument in verify so it does not matter what name is assigned
      try {
        const user = await db.retrieveUserByEmail(email);
        /*done function in Passport.js is a callback that you must call to complete a step in the Passport flow — whether it's authentication, serialization, or deserialization
        Syntax: done(error, user, info)
          Argument	Meaning
          error	An error object if something failed — pass null if no error occurred
          user	The authenticated (or deserialized) user object, or false if failed
          info	Optional extra info (e.g., "Invalid credentials")
        */
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        //bcrypt compare

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
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

    done(null, user);
  } catch(err) {
    done(err);
  }
});