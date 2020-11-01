const express = require('express');

const router = express.Router();
const { Album } = require('../../db/db')

router.get('/', (req, res) => {
	if (req.session.user) {
		res.redirect('/app/view/albums');
	} else {
		res.redirect('/app/user/login')
	}
});

router.use('/create', require('./create.js'));
router.use('/view', require('./view.js'));
router.use('/user', require('./user.js'));

module.exports = router;