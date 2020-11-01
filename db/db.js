const mongoose = require('mongoose');
const Grid = require('gridfs-stream')

const url = process.env.MONGO_URL

const conn = mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

let songSchema = new mongoose.Schema({
    title: String,
    album: String,
    artist: String,
    source_id: String 
});

let Song = mongoose.model('Song', songSchema); 

let albumSchema = new mongoose.Schema({
    title: String,
    artist: String,
    image_id: String,
    songs: [ songSchema ]
})

let Album = mongoose.model('Album', albumSchema)

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    favoriteAlbums: [ String ],
    favoriteArtists: [ String ],
    favoriteSongs: [ String ]
})

let User = mongoose.model('User', userSchema);

// setup gridfs

let gfs;

db.once('open', function () {
    gfs = Grid(db.db, mongoose.mongo);
});

module.exports = { mongoose, Song, url, db, conn, gfs, Album, User };

