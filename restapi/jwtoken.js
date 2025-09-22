import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to API'
    });
});
//use token verification middleware in protected route same with how checkAuthentication is used
app.post('/api/posts', verifyToken, (req, res) => {
    //Verify token
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});
//Route for login - to get token
app.post('/api/login', (req, res) =>{
    //Mock user - part where user logs credential and you verify in database
    //return user
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    }
    //Syntax jwt.sign({<payload>}, '<secret key>', {<options>}, callback(err, token)) => async version
    jwt.sign({user}, 'secretkey', { expiresIn: '30s'}, (err, token) => {
        res.json({
            token //send token - to next middleware
        });
    });
});

/*
FORMAT OF TOKEN
Authorization: Bearer <access_token>
*/

//Create a middleware to verify token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== undefined){
        //split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //Set token
        req.token = bearerToken;
        //Next middleware
        next();
    } else {
        //Forbidden access
        res.sendStatus(403);
    }

}

app.listen(process.env.PORT, () => console.log(`Server listening on PORT ${process.env.PORT}`))