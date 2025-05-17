import express from "express";

const app = express();

app.get("/", (req, res) => res.send("Hello, world!")); //This what we called as route

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`My first Express app - listening on port ${PORT}!`);
});