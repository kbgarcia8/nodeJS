import express from "express";
const app = express();
import authorRouter from "./routers/authorRouter.js";
import bookRouter from "./routers/bookRouter.js";
import indexRouter from "./routers/indexRouter.js";

app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/", indexRouter);

//error handling using middleware
app.use((err, req, res, next) => {
  console.error(err);
  // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app with routers - listening on port ${PORT}!`);
});
