const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');
const app = express();

app.use(express.json());

app.get('/token/:username', (req, res) => {
    let username = req.params.username;
    if (username === '' || !username) {
        res.status(400).send('Invalid parameters');
        return;
    }
    let token = jwt.sign({id:'1',user:username}, 'iliketoken', {expiresIn: '30m'});
    res.json({
        success: true,
        error: null,
        token
    });
});

app.post('/token/refresh', (req, res) => {
    let body = req.body;
    if (!body || !body.token) 
        res.status(400).send('Invalid body');
    else {
        let decoded = jwt.decode(body.token);
        let token = jwt.sign({id:'1',user:decoded.user}, 'iliketoken', {expiresIn: '30m'});
        res.json({
            success: true,
            error: null,
            token
        });
    }
});

app.get('/users', verifyToken, (req, res) => {
    db.getUsers(null,result => {
        res.send(result);
    });
});

app.get('/user/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    db.getUsers(id, result => {
        res.send(result);
    });
});

app.post('/newUser', verifyToken, (req, res) => {
    let body = req.body;
    if (!body || !body.username) 
        res.status(400).send('Invalid body');
    else {
        db.insertUser(body, result => {
            res.send(result);
        });
    }
});

app.post('/updateUser', verifyToken, (req, res) => {
    let body = req.body;
    if (!body && !body.username && !body.id) 
        res.status(400).send('Invalid body');
    else {
        db.updateUser(body, result => {
            res.send(result);
        });
    }
});

//Validate JWT Token against a secrey key
function verifyToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')[1];
        jwt.verify(bearer, 'iliketoken',(err,value) => {
            if (!err) 
                next();
            else {
                logUnauthorized(req);
                res.sendStatus(401);
            }
        });
    } else {
        logUnauthorized(req);
        res.sendStatus(401);
    }
}

function logUnauthorized(req) {
    console.log('Unauthorized ' + req.ip);
}

app.listen(3000,() => {
    console.log('Server start');
})