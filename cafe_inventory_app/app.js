import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
//Routers
import indexRouter from "./routes/indexRouter.js";
import loggedUserRouter from "./routes/loggedUserRouter.js";
import menuRouter from "./routes/menuRouter.js";
import productRouter from "./routes/productRouter.js";

const app = express();
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "ejs");

app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true })); //express level middleware to parse the form data into req.body
app.use(express.json()); //express level middleware to parse json

app.use("/", indexRouter);
app.use("/user", loggedUserRouter);
app.use("/menu", menuRouter);
app.use("/products", productRouter);


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
