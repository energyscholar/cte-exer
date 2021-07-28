var express = require('express');
var session = require('express-session');
var bodyParser= require('body-parser');
//var pageRouter = require('./routes/pages');
var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./core/user');
var Data = require('./core/data');
var app=express();
var users = [{"id":0, "username":"", "password":"", "firstname":"", "lastname":""}];

// Implementation of LocalStrategy passport authentication

// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    console.log("serializeUser user[0].id is " + user[0].id);
    done(null, user[0].id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    done(null, users[0]);
});

// passport local strategy for local-login, local refers to this app
passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
        const user = new User();
        var foundUser;
         foundUser = user.find(username, function(result){
             console.log("after find result is " + result);
             if (result != null) {
                 console.log("username is "+username+" and password is " + password);
                 console.log("just after find,result[0].username is |"+result[0].username + "|  result[0].password = |" + result[0].password+"|");
                 if (username === result[0].username && password === result[0].password) {
                     console.log("login succeeds");
                     return done(null, result, {"message": "Login successful"});
                 } else {
                     console.log("login fails");
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


app.post("/login", 
    passport.authenticate("local-login", { failureRedirect: "/"}),
     function (req, res) {
        console.log("app.post login succeeded");
        res.redirect("/data");
    }
);


app.get("/logout", function (req, res) {
    req.logout();
    res.send("logout success! <a href='http://3.84.203.16:3000/'>home</a>");
});

app.get('/data', isLoggedIn, function  (req, res) {    
    const data = new Data();
    par=req.params
    data.read(par,function(result){
        res.render('data',{title:"Enter Health Data",data:result, message: 'Hello world!'});
    })
});

app.post('/register', (req, res, next) => {  
    const user= new User();
    let userInput = {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };
    
    user.create(userInput, function(lastId) {
        if(lastId) {
            user.find(lastId, function(result){
                res.redirect('/');
            });
          
        }else{
            console.log('error creatinmg the user')
        }
    }
)});

app.post('/data', isLoggedIn, function (req, res) {  
    const data= new Data();
    let dataInput = {
        systolic: req.body.systolic,
        diastolic: req.body.diastolic,
        hr: req.body.hr
    };
    
    data.create(dataInput, function(lastId) {
        if(lastId) {
            user.find(lastId, function(result){
                res.redirect('/data');
            });
          
        }else{
            console.log('error creating data: user not found');
                res.redirect('/data/'); // Comment: handle errors gracefully
        }
    }
)});


app.get('/', (req, res, next) => {  
    res.render('login', {title:"Welcome to CTE Exercise"});
});

app.get('/register',  function (req, res) {        
    res.render('register', {title:"Register"});
});

// Configure the app
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);

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

