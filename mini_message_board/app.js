import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
import indexRouter from "./routers/indexRouter.js";
import newRouter from "./routers/newRouter.js";

const app = express();
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "ejs");

app.use("/new", newRouter);
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
