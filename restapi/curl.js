import 'dotenv/config';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

let users = {
    1: {
        id: '1',
        username: 'Robin Wieruch'
    },
    2: {
        id: '2',
        username: 'Dave Davids'
    },
}

let messages = {
    1: {
        id: '1',
        text: 'Hello World',
        userId: '1',
    },
    2: {
        id: '2',
        text: 'By World',
        userId: '2',
    },
}

app.get('/users', (req,res) => {
    res.send(Object.values(users));
});

app.get('/users/:userId', (req,res) => {
    res.send(users[req.params.userId]);
});

app.post('/messages', (req,res) => {
    const id = uuidv4();
    const message = {
        id,
        text: req.body.text
    };

    messages = {
        ...messages,
        [id]: message
    }

    return res.send(messages);
});

app.get("/messages", (req,res) => {
    res.send(Object.values(messages));
})

app.post('/users', (req,res) => {
    res.send('Received a POST HTTP method on user resource');
});

app.put('/users', (req,res) => {
    res.send('Received a PUT HTTP method on user resource');
});

app.delete('/users', (req,res) => {
    res.send('Received a DELETE HTTP method on user resource');
});

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
})