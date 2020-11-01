const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { User } = require('../../db/db')

let encodedParser = bodyParser.urlencoded({ extended: false })

router.post('/login', encodedParser, (req, res) => {
    User.find({username: req.body.user, password: req.body.pass}, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (user.length < 1) {
            res.send('no user found')
        } else {
            req.session.user = user.username;
            res.redirect('/app/view/album')
        }
    });
    
});

module.exports = router;