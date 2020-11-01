const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/app/view/albums');
    } else {
        res.render('login-user');
    }
})

module.exports = router;