import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
//session/passport
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
//db connection
import pool from "./db/pool.js";
//Routers
import indexRouter from "./routes/indexRouter.js";

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
