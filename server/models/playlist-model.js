const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.

    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        songs: {
            type: [{
                title: String,
                artist: String,
                youTubeId: String
            }], required: true
        },

        likes: { type: [], required: true },
        dislikes: { type: [], required: true },
        published: { type: Boolean, required: true },
        publishedDate: { type: Date, required: true },
        publisher: { type: String, required: true },
        comments: {
            type: [{
                username: String,
                comment: String
            }], required: true
        },
        listens: { type: Number, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
