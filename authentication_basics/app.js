import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
//session/passport
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
//Routers
import indexRouter from "./routes/indexRouter.js";
//Queries
import * as db from "./db/queries.js";

const app = express();
//declare public as asset path
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);
const assetsPath = path.join(__dirname, "public");
//declare views directory
app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "ejs");
//use assets path as directory of static files
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true })); //express level middleware to parse the form data into req.body
app.use(express.json()); //express level middleware to parse json

//use session/passport
app.use(session({ secret: "cats", resave: false, saveUninitialized: false })); //setup
app.use(passport.session()); //enable session

app.use("/", indexRouter);

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





//error handling using middleware
app.use((err, req, res, next) => {
  console.error(err);
  // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
