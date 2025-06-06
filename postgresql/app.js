import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
import indexRouter from "./routers/indexRouter.js";
import newRouter from "./routers/newRouter.js";
import dotenv from "dotenv";
dotenv.config();

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
app.use("/new", newRouter);

//error handling using middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}!`);
});
