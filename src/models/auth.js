const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: false,
        trim: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    twibs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Twibs'
        }
    ],
    twibReply: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TwibReply'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)