import express from 'express';

const app = express();

app.use(express.json()); // for JSON request bodies
app.use(express.urlencoded({ extended: true })); // for form submissions

app.post("/", (req, res) => {
    res.json(req.body);
});

app.listen(3000, () => console.log('Server started'));