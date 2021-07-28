const util = require('util');
const mysql = require('mysql');
//database connection and configuration
var database = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "YwhetJd",
        database:"CTE_EXERCISE"
});
// Hardcoded  DB password is no good in PROD environment!  
// Add code to tokenize the PROD DB password so it's not in the code.  This is a devops task.

// We'll not use a connection pool in this case.
// If the app is going to be under any load of course use a connection pool
database.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

database.query=util.promisify(database.query);
module.exports= database;
