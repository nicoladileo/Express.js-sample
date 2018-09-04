const express = require('express');
const jwt = require('jsonwebtoken');
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

app.post('/profile', verifyToken, (req,res) => {
    res.send('Profile OK');
});

app.post('/list', verifyToken, (req,res) => {
    res.send('List OK');
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