import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
//constants
import { notAuthenticatedLinks, memberAuthenticatedLinks, guestAuthenticatedLinks, adminAuthenticatedLinks } from "./constants/constants.js";
//session/passport
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; //run current configurations via passport.use
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
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_DB,
  password: process.env.DATABASE_USER_PASSWORD?.trim(),
  port: Number(process.env.DATABASE_PORT),
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n'), // To properly format multi-line certs
  },
});


app.use(session({
    store: new PGStore({ pool: pgPool, createTableIfMissing: true }), //createTableIfMissing resolves Error: relation "session" does not exist
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 }
}));

//use session in passport
app.use(passport.initialize());
app.use(passport.session()); //enable session
app.use(flash()); //for error handling of passport after failureRedirect


app.use("/", indexRouter);
//app.use("/messages", messageRouter);
//app.use("/users", usersRouter);

//error handling using middleware
app.use((err, req, res, next) => {
  console.error(err); //display error on developer options console
  console.log(err)
  //failsafe incase passport still has an error and render req.isAuthenticated undefined
  const isAuthenticated = typeof req.isAuthenticated === 'function' ? req.isAuthenticated() : false;
  
  res.render("systemError", {
      title: "Error Page",
      notAuthenticatedLinks,
      //memberAuthenticatedLinks,
      //guestAuthenticatedLinks,
      //adminAuthenticatedLinks,
      access: isAuthenticated,
      user: req.user,
      error: err
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
