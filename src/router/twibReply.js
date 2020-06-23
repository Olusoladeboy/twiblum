const   express = require('express'),
        app = express(),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        flash = require('connect-flash'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        User = require('../models/auth'),
        Twibs = require('../models/twibs'),
        TwibReply = require('../models/twibReply'),
        router = new express.Router();

// twibReply Posting
router.post('/:username/:twib_id', isLoggedIn, async (req, res) => {
    const userId = req.user._id
    const username = {
        username: req.params.username
    };
    const twib_id = {
        _id: req.params.id
    };
    if(req.params.username === req.user.username){
        Twibs.findById(req.params.twib_id, async(err, twib) => {
            if(err){
                res.send(err.message)
            } else {
                await TwibReply.create(
                    {
                        twibReply: req.body.twibReply,
                        author: userId
                    },
                    async (err, twibReply) => {
                        console.log(twibReply)
                        if(err){
                            res.send(err.message)
                        } else {
                            twib.twibReply.push(twibReply)
                            twib.save().then(
                                User.findOne(username, async (err, user) => {
                                    if(err){
                                        res.send(err.message)
                                    } else {
                                        user.twibReply.push(twibReply)
                                        user.save()
                                        res.send('Successful')
                                    }
                                })
                            )
                        }
                    }
                )
            }
        })        
    } else {
        res.status(401).send('error')
    }
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.send('Please, login')
    // req.flash('error', 'Oops, Please Login!')
    // res.redirect('/login')
}



module.exports = router;