const express = require('express');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const { Album } = require('../../db/db');
const Grid = require('gridfs-stream')

const router = express.Router();

// mongo setup
const { Song, db, mongoose } = require('../../db/db');

let gfs;

db.once('open', function() {
    gfs = Grid(db.db, mongoose.mongo);
});

const url = process.env.MONGO_URL;
// multer setup
let storage = new GridFsStorage({ url });
let upload = multer({ storage });

router.post('/album', upload.single('album_art'), (req, res) => { //api
    let album_title = req.body.album_title.toLowerCase()
    let artist = req.body.artist.toLowerCase()
    let file = req.file;

    let album = new Album({ 
        title: album_title,
        artist: artist,
        image_id: file.id
    })

    Album.find({title: album_title}, function(err, arr) {

        // if there is an error, exit and report to console
        if (err) {
            console.log(err);
        }
        
        //else, create or update album
        if (arr.length < 1) {
            album.save()
            res.json({
                res: "album created"
            })
        } else {
            Album.updateOne({title: album_title}, {artist: artist}, function(err, arr) {
                if (err) {
                    console.log(err)
                }
                res.json({
                    res: "album updated",
                    updated: arr.n
                })
            })
        }
    });
});

router.post('/song', upload.single('song_source'), (req, res) => { //api
    //make sure all data put into the db is lowercase
    let title  = req.body.song_title.toLowerCase();
    let album  = req.body.album_title.toLowerCase();
    let artist = req.body.artist_name.toLowerCase();
    let file = req.file

    Album.find({title: album}, function (err, arr) {
        if (err) {
            console.log(err);
        }

        let song = new Song({ 
            title: title,
            album: album,
            artist: artist,
            source_id: file.id
        });

        if (arr.length > 0) {
            Album.updateOne({title: album}, { $push: { songs: [ song ] } }, function(err, arr) {
                if (err) {
                    console.log(err)
                }
                res.redirect("/app/")
            });
        } else {
            res.send("no album found!");
        }
    });
});

module.exports = router;