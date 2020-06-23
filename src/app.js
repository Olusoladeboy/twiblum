const   express = require('express'),
        app = express(),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        flash = require('connect-flash'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        User = require('./models/auth'),
        Twibs = require('./models/twibs'),
        TwibReply = require('./models/twibReply')
        index = require('./router/index'),
        twib = require('./router/twib'),
        twibReply = require('./router/twibReply'),
        user = require('./router/user');


// Mongoose Configuration
require('./database/mongoose')

// port configuration
const port = process.env.PORT || 3000

// express app configuration
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.json())
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(flash())
app.use(require('express-session')({
    secret: 'Twiblum',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session()) 
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(async (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next();
})

// app.get('*', async (req, res) => {
//     res.render('404')
// })






app.use(index);
app.use(user);
app.use(twib);
app.use(twibReply)

app.get('/404', async (req, res) => {
    res.render('404')
})

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
    // res.status(error.status || 500).send({
    // error: {
    //     status: error.status || 500,
    //     message: error.message || 'Internal Server Error',
    // },
    // });
    res.status(error.status || 500).redirect('/404')
});





app.listen(port, () => {
    console.log('Server Started')
})