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



// twib posting
router.post('/twib', isLoggedIn, async (req, res) => {
    const username = {
        username: req.user.username
    }
    if(req.user.username){
        await User.findOne(username, async (err, user) => {
            if(err){
                res.send(err.message)
            } else {
                Twibs.create(
                    {
                        twib: req.body.twib,
                        author: user._id
                    },
                    async (err, twib) => {
                        if(err){
                            res.send(err.message)
                        } else {
                            user.twibs.push(twib)
                            user.save()
                            res.redirect('/')
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
    req.flash('error', 'Oops, Please Login!')
    res.redirect('/login')
}



module.exports = router;