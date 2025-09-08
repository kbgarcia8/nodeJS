import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
//constants
import { notAuthenticatedLinks, memberAuthenticatedLinks, guestAuthenticatedLinks, adminAuthenticatedLinks } from "./constants/constants.js";
//passport
import passport from "passport";
import "./config/passport.js"; //run current configurations via passport.use
import flash from "connect-flash";
//session-prisma
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from './prisma/schema/generated/prisma/index.js';
//.env
import dotenv from 'dotenv';
dotenv.config(); 
//Routers
import indexRouter from "./routes/indexRouter.js";
import filesRouter from "./routes/filesRouter.js";
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

//session persistence & use session in app
const prisma = new PrismaClient();

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
      secure: process.env.NODE_ENV === "production", // use HTTPS-only cookies in prod
      httpOnly: true, // prevents JS access to cookies
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

//use session in passport
app.use(passport.initialize());
app.use(passport.session()); //enable session
app.use(flash()); //for error handling of passport after failureRedirect


app.use("/", indexRouter);
app.use("/files", filesRouter);
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
