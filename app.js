var express = require('express');
var session = require('express-session');
var bodyParser= require('body-parser');
var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./core/user');
var Data = require('./core/data');
var app=express();

var users = [{"id":0, "username":"", "password":"", "firstname":"", "lastname":""}]; // Sets a dummy array for serializing/deserializing users to session data
// Note that above dummy user presents a potential security vulnerability.  TODO: Clean this up to remove vulnerability

// Implementation of LocalStrategy passport authentication

// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    done(null, user[0].id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    done(null, users[0]);
});

// passport local strategy for local-login, local refers to this app
passport.use('local-login', new LocalStrategy(  {passReqToCallback: true},
    function (req, username, password, done) {
        const user = new User();
             user.find(username, function(result){
             //console.log("after find result is " + result);  
             // TODO: implement system where console.log statements are visible in DEV mode yet  don't execute in PROD
             /*
             This looks like:
             if (DEV) {
                 console.log("Log statement visible only in DEV");
             } 
             Real production code should NEVER have commented out code.  That said, console.log statement will be commented out.
             */ 
             if (result != null) {
                 //console.log("username is "+username+" and password is " + password);
                 //console.log("just after find,result[0].username is |"+result[0].username + "|  result[0].password = |" + result[0].password+"|");
                 if (username === result[0].username && password === result[0].password) {
                     //console.log("login succeeds");
                     // TODO: Display messages in UI so user knows login succeeded. 
                     // put user info on session for later use! 
                     req.session.username  = result[0].username;
                     req.session.userid    = result[0].id;
                     req.session.firstname = result[0].firstname;
                     req.session.lastname  = result[0].lastname;

                     return done(null, result, {"message": "Login successful"});
                 } else {
                     //console.log("login fails");
                     return done(null, false, {"message": "Password does not match"});
                   }
             } else {
                 return done(null, false, {"message": "User not found."});
             }
         });
    })
);

// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
 
// initialize passport and and session for persistent login sessions
// TODO: In PROD mode the session secret should be added by DOVOPS and not in code
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
 
// route middleware to ensure user is logged in
// This only blocks two pages: POST (/data) and GET(/data)
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
 
    res.sendStatus(401); // send unauthorized HTTP 401 message
}
 
// api endpoints for login, content and logout

// Catch login attempt and process via passport-local,
// TODO: add version for passport-google.
app.post("/login", 
    passport.authenticate("local-login", { failureRedirect: "/"}),
     function (req, res) {
        res.redirect("/data");
    }
);

// Logout.  Clears session data.  
// TODO: Provide better UI message to user showing successful logout 
app.get("/logout", function (req, res) {
    req.logout();
    res.send("logout success! <a href='http://3.84.203.16:3000/'>home</a>");
});

// Process user registration
// TODO: Add UI message for "Registration Successful"
// TODO: Currently redirects user to login form.  Could instead double as a successful login.  That's a requirements decision.
// TODO: Add both client-side and server-side  validation of all registration fields.
// Possibly also add email confirmation of registration.  Depends on requirements.
app.post('/register', (req, res, next) => {  
    const user= new User();
    let userInput = {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };

    //  Insert new user record
    user.create(userInput, function(lastId) {
        if(lastId) {
            user.find(lastId, function(result){
                res.redirect('/');
            });
        } else {
            //console.log('error creatinmg the user')
            // TODO: Display message to user showing that registration failed.
        }
    }
)});

// Go to page where user enters systolic, diastolic, and heart rate data.  Requires login.
app.get('/data', isLoggedIn, function  (req, res) {    
    const data = new Data();
    par=req.params;
    var userid = req.session.userid;
    data.read(par,userid, function(result){
        res.render('data',{title:"Enter Health Data",data:result, message: 'Hello world!'});
    })
});

// Catch post of user health data 
app.post('/data', isLoggedIn, function (req, res) {  
    const data= new Data();
    let dataInput = {
        id: req.session.userid,
        systolic: req.body.systolic,
        diastolic: req.body.diastolic,
        hr: req.body.hr
    };
    data.create(dataInput, function(lastId) {
        if(lastId) {
            user.find(lastId, function(result){
                res.redirect('/data'); // TODO: factor out lastId.  with req.session.userid it doesn't matter
            });
          
        }else{
            res.redirect('/data/'); // TODO: Handle errors gracefully
        }
    }
)});

// Main entry page
app.get('/', (req, res, next) => {  
    res.render('login', {title:"Welcome to CTE Exercise"});
});

// Registration page
app.get('/register',  function (req, res) {        
    res.render('register', {title:"Register"});
});

// Configure the app
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000); // TODO: Serve real app on ports 80 and/or 443.  

app.set('view engine', "pug")


// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));


//app.use('/', pageRouter);
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

