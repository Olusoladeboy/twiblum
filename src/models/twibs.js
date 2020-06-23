const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose')

const TwibSchema = new mongoose.Schema({
    twib: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    twibReply: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TwibReply'
        }
    ]    
})

module.exports = mongoose.model('Twibs', TwibSchema)