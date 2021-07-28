// utility methods for working with users.  
const database = require('./database');
const bcrypt = require('bcrypt');

function User() {};

User.prototype = {
    // Find the user data by id or username.
    // Consider splitting into two methods to avoid possible bugs from dual-functionality.
    // OK as is iff it's unit tested.  Which it's currently not. 
    find : function(user = null, callback)
    {
        // if the user variable is defined
        if(user) {
            // if user = number return field = id, if user = string return field = username.
            var field = Number.isInteger(user) ? 'id' : 'username';
        }
        // prepare the sql query
        let sql = `SELECT * FROM users WHERE ${field} = ?`;

        database.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    create : function(body, callback){
        // let pwd=body.password
        // Bruce: in a real app we'd insert a salted hash of the password
        // Not using hashed passwords makes one an easy and desireable target for attackers.
        // salted passwords blocks use of rainbow tables.
        // body.password= bcrypt.hashSync(pwd,10);  // Here's how to do the hashing.  This exercise app stores raw unhashed passwords.
        // TODO: Check for duplicate username to prevent multiple accounts with same email address.  Not in CTE EXERCISE specs so not done.
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }

        let sql = `INSERT INTO users(username,password,firstname,lastname) VALUES (?, ?, ?, ?)`;

        database.query(sql, bind, function(err, result) {
            if(err) throw err;
            // return the last inserted id if there is no error.  No particular reason in this simple CRUD app.
            callback(result.insertId);
        });
    }
    /* Not used in the app as it currently is
    index: function(user, callback){
       // Get all users.  
        let sql= `SELECT * FROM users`;

        database.query(sql,user,function(err, result) {
            
            if(err) throw err

            if(result) {
                callback(result)
          
            }
        });
    }
    */

}
module.exports = User;
