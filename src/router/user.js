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

// User's Profile
router.get('/:username', isLoggedIn, async (req, res) => {
    const username = {
        username: req.params.username
    }
    if (req.params.username === req.user.username) {
        try {
            await User.findOne(username).populate({
                path: 'twibs',
                populate: {
                    path: 'twibReply',
                    model: 'TwibReply'
                },
                populate: {
                    path: 'author',
                    model: 'User'
                }
            }).populate('twibReply').exec(async (err, user) => {
                if(err){
                    res.redirect('/')
                    req.flash('error', err)
                } else {
                    res.render('profile', {user: user})
                }
            })         
        } catch (error) {
            res.send(error)
        }       
    } else {
        req.flash('error', 'Unauthorized')
        res.render('404')
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