import express from "express";
const app = express();
import authorRouter from "./routers/authorRouter.js";
import bookRouter from "./routers/bookRouter.js";
import indexRouter from "./routers/indexRouter.js";

app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app with routers - listening on port ${PORT}!`);
});
