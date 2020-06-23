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


// Homepage
router.get('/', async (req, res) => {
    var feeds = []
    Twibs.find({}).populate('twibReply author').exec(async (err, twib) => {
        if(err){
            res.send(err.message)
        } else {
            twib.forEach(twib => {
                feeds.push(twib)
            });
            User.find({}, (err, users) => {
                if(err){
                    res.send(err)
                } else {
                    res.render('index', {
                        feeds: feeds,
                        users: users
                    })
                }
            })
        }
    })
    // TwibReply.find({}).populate('author').exec(async (err, twibReply) => {
    //     if(err){
    //         res.send(err.message)
    //     } else {
    //         twibReply.forEach(twibReply => {
    //             feeds.push(twibReply)
    //         });
    //         // res.send(feeds)
    //         res.render('index', {feeds: feeds})
    //     }
    // })
    
})

router.get('/signup', (req, res) => {
    res.render('signup')
})


// New User Registration
router.post('/signup', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
    })
    const pw = req.body.password
    if(pw.length < 8){
        req.flash('error', 'Password should be greater than 8 characters')
        res.redirect('/signup')
    }
    User.register(newUser, req.body.password, async (err, User) => {
        if(err){
            req.flash('error', err)
            res.redirect('/signup')
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/')
        })
    })
})

router.get('/login', (req, res) => {
    res.render('login')
})

// login routes
router.get('/auth-success', async (req, res) => {
    req.flash('success', 'Successfully logged in as: ' + req.user.username)
    res.redirect('/')
})

router.get('/auth-failure', async (req, res) => {
    req.flash('error', 'Incorrect Details, try again')
    res.redirect('/login')
})

router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/auth-success', 
        failureRedirect: '/auth-failure'
    }), async (req, res) => {

})

router.get('/logout', async (req, res) => {
    req.logout()
    res.redirect('/login')
    req.flash('success', 'GoodBye!!!')
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Oops, Please Login!')
    res.redirect('/login')
}


module.exports = router;