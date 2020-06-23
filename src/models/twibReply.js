const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose')

const TwibSchema = new mongoose.Schema({
    twibReply: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('TwibReply', TwibSchema)