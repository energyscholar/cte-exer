var express = require('express');
var session = require('express-session');
var bodyParser= require('body-parser');
var pageRouter = require('./routes/pages');
var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;

var app=express();

// Implementation of LocalStrategy passport authentication

// hardcoded users, ideally the users should be stored in a database
var users = [{"id":111, "username":"amy@example.com", "password":"amyspassword"}];
 
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    done(null, users[0].id);
});
passport.deserializeUser(function (id, done) {
    done(null, users[0]);
});
 
// passport local strategy for local-login, local refers to this app
passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
        var SQL = 'SELECT * FROM users WHERE username = ? AND password = ?';

        if (username === users[0].username && password === users[0].password) {
            return done(null, users[0]);
        } else {
            return done(null, false, {"message": "User not found."});
        }
    })
);
 
// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
 
// initialize passport and and session for persistent login sessions
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
 
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
 
    res.sendStatus(401);
}
 
// api endpoints for login, content and logout

app.get("/login", function (req, res) {
    res.send("<p>Please login!</p><form method='post' action='/login'><input type='text' name='username'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");
});


// handle login here, rather than in router
app.post("/login", 
    passport.authenticate("local-login", { failureRedirect: "/"}),
     function (req, res) {
        res.redirect("/content");
    }
);


app.get("/content", isLoggedIn, function (req, res) {
    res.send("Congratulations! you've successfully logged in.");
});

app.get("/logout", function (req, res) {
    req.logout();
    res.send("logout success!");
});

// End passport authentication

// Configure the app
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);

app.set('view engine', "pug")


// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));


app.use('/', pageRouter);
app.use((req, res, next) =>  {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

// Launch app
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});
module.exports = app;

