const express = require('express');
const router = express.Router();

router.get('/song', (req, res) => { //app
    res.render('create-song', {title: 'Create Song'})
});

router.get('/album', (req, res) => { //app
    res.render('create-album')
});

module.exports = router;