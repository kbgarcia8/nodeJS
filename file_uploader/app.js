import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
//constants
import { notAuthenticatedLinks, memberAuthenticatedLinks, guestAuthenticatedLinks, adminAuthenticatedLinks } from "./constants/constants.js";
//session/passport
import session from "express-session";
import passport from "passport";
//import "./config/passport.js"; //run current configurations via passport.use
import flash from "connect-flash";
//session persistence
import pgSession from 'connect-pg-simple';
import { Pool } from "pg";
//.env
import dotenv from 'dotenv';
dotenv.config(); 
//Routers
import indexRouter from "./routes/indexRouter.js";
//import messageRouter from "./routes/messageRouter.js";
//import usersRouter from "./routes/userRouter.js";

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

//session persistence for development purposes- will have to explore
const PGStore = pgSession(session);
//pool instance
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(session({
    store: new PGStore({ pgPool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 }
}));

//use session in passport
app.use(passport.initialize());
app.use(passport.session()); //enable session
//app.use(flash()); //for error handling of passport after failureRedirect


app.use("/", indexRouter);
//app.use("/messages", messageRouter);
//app.use("/users", usersRouter);

//error handling using middleware
app.use((err, req, res, next) => {
  console.error(err); //display error on developer options console
  console.log(err)
  
  res.render("systemError", {
      title: "Error Page",
      notAuthenticatedLinks,
      memberAuthenticatedLinks,
      guestAuthenticatedLinks,
      adminAuthenticatedLinks,
      access: req.isAuthenticated(),
      user: req.user,
      error: err
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
