const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser')

const { Album, Song } = require('../../db/db');
const { urlencoded } = require('body-parser');

var encodedParser = bodyParser.urlencoded({ extended: false });
var rawParser = bodyParser.raw();
var textParser = bodyParser.text();
var jsonParser = bodyParser.json();

router.get('/album', (req, res) => {
    let albumArr = [];
	let songsArr= [];

	Album.find({}, function (err, arr) {
		arr.forEach(e => {
			if (e.songs.length > 0) {
				albumArr.push(e);
			}
		});
		res.render('view-albums', {albums: albumArr, source_url: process.env.SOURCE_URL} );
	});
});

router.get('/playlist', (req, res) => {
    let songsArr = [];
    Album.find({}, function (err, arr) {
        if (err) {
            console.log(err)
        }
        
        arr.forEach(album => {
            console.log(arr)
            if (album.songs.length > 0) {
                album.songs.forEach(song => {
                    songsArr.push(song);
                });   
            }
        })
        res.render('view-playlist', {songs: songsArr});
    })
})

router.post('/artist', encodedParser, (req, res) => {
    let artistArr = [];
    let songsArr= [];

	Album.find({ artist: req.body.artist }, function (err, arr) {
		arr.forEach(e => {
            artistArr.push(e);
        });
        
        if (typeof(req.body.artist) == "string") {
            res.render('view-albums', {albums: artistArr, source_url: process.env.SOURCE_URL, artistView: true})
        }
		res.render('view-albums', {albums: artistArr, source_url: process.env.SOURCE_URL} );
    });
    
    //res.send(req.body)
})

router.get('/artistselect', (req, res) => {
    let availArtists = [];

    Album.find({}, function (err, arr) {
		arr.forEach(e => {
			if (e.songs.length > 0) {
                if (availArtists.indexOf(e.artist) == -1) {
                    availArtists.push(e.artist);
                }
			}
        });
        res.render('view-artists', { artists: availArtists });
	});
})

module.exports = router;