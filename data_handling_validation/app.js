import express from "express";
const app = express();
import usersRouter from "./routes/userRouter.js";

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
//When extended is false, our server will only accept a string or an array of data, so we set it to true for some added flexibility
app.use("/", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
