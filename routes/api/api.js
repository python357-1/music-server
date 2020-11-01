const express = require('express')
const router = express.Router();

const Grid = require('gridfs-stream')

const { Album, db, mongoose } = require('../../db/db')

let gfs;

db.once('open', function() {
    gfs = Grid(db.db, mongoose.mongo);
});

router.use('/create', require('./create.js'))
router.use('/user', require('./user.js'))

router.get('/view/:title', (req, res) => {
	Album.find({title: req.params.title}, function(err, arr) {
		let albums = [];
		if (err) {
			console.log(err)
		}
		
		if (JSON.stringify(arr) !== '[]') {
			let readstream = gfs.createReadStream({_id: arr[0].image_id});
			readstream.pipe(res);
		} else {
			res.json({
				err: 'no album found of title ' + req.params.title
			})
		}
	})
})

router.get('/stream/:album/:title', (req, res) => {
	Album.find({title: req.params.album}, function (err, arr) {
		arr.forEach(a => {
			let songsArr = [];
			a.songs.forEach(s => {
				if (s.title == req.params.title) {
					let readstream = gfs.createReadStream({ _id: s.source_id})
					readstream.pipe(res);
				}
			})
		})
		
	})
});

module.exports = router;
