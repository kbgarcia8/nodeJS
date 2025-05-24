import express from "express";
import authorRouter from "./routers/authorRouter.js";
import bookRouter from "./routers/bookRouter.js";
import indexRouter from "./routers/indexRouter.js";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url); 
/* 
import.meta.url gives you the file URL of the current module meaning this app.js for example then
fileURLToPath converts the URL to a usable string 
*/
const __dirname = dirname(__filename); //returns the directory part of the argument path

app.use("/authors", authorRouter);
app.use("/books", bookRouter);
//app.use("/", indexRouter);

//error handling using middleware
app.use((err, req, res, next) => {
  console.error(err);
  // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
  res.status(err.statusCode || 500).send(err.message);
});

/*app.set() is a method to assign settings or configurations for your app. It takes two arguments:
  1. The name of the setting (a string).
  2. The value to assign to that setting.
 */
app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "ejs"); //Tells Express what template engine to use to render views

//Reusable templates data
const links = [
  { href: "/", text: "Home" },
  { href: "about", text: "About" },
];

const aboutData = {
  title: "About Us",
  description: "We are a passionate team dedicated to building great web experiences.",
  teamMembers: [
    {
      name: "Alice Johnson",
      role: "Frontend Developer",
      bio: "Alice specializes in responsive web design and accessibility."      
    },
    {
      name: "Bob Smith",
      role: "Backend Developer",
      bio: "Bob loves working with databases and building secure APIs."      
    },
    {
      name: "Charlie Lee",
      role: "UI/UX Designer",
      bio: "Charlie crafts intuitive interfaces and seamless user experiences."      
    }
  ]
};

app.get("/", (req, res) => {
  res.render("index", { links: links, users: aboutData.teamMembers });
});
app.get("/about", (req, res) => {
  res.render("about", { links: links, data: aboutData });
});
//Declare static assets path
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app with routers - listening on port ${PORT}!`);
});
