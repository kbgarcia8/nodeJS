import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
//constants
import { notAuthenticatedLinks, memberAuthenticatedLinks } from "./constants/constants.js";
//session/passport
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; //run current configurations via passport.use
import flash from "connect-flash";
//Routers
import indexRouter from "./routes/indexRouter.js";
import { access } from "node:fs";


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
app.use(flash()); //for error handling of passport after failureRedirect


app.use("/", indexRouter);

//error handling using middleware
app.use((err, req, res, next) => {
  console.error(err); //display error on developer options console
  
  res.render("systemError", {
      title: "Error Page",
      notAuthenticatedLinks,
      memberAuthenticatedLinks,
      access: req.isAuthenticated(),
      error: err
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
