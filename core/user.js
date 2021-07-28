const database = require('./database');
const bcrypt = require('bcrypt');


function User() {};

User.prototype = {
    // Find the user data by id or username.
    find : function(user = null, callback)
    {
        console.log("find : user = " + user);
        // if the user variable is defind
        if(user) {
            console.log("user is " + user);
            // if user = number return field = id, if user = string return field = username.
            var field = Number.isInteger(user) ? 'id' : 'username';
        }
        // prepare the sql query
        let sql = `SELECT * FROM users WHERE ${field} = ?`;
        //console.log("find SQL is " + SQL);

        database.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                console.log("find got a record");
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    create : function(body, callback){
        // let pwd=body.password
        // Bruce: in a real app we'd insert a salted hash of the password
        // body.password= bcrypt.hashSync(pwd,10); 

        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
            console.log("Looping through form values:" + prop);
        }

        let sql = `INSERT INTO users(username,password,firstname,lastname) VALUES (?, ?, ?, ?)`;

        database.query(sql, bind, function(err, result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
    },
    index: function(user, callback){
       

        let sql= `SELECT * FROM users`;

        database.query(sql,user,function(err, result) {
            
            if(err) throw err

            if(result) {
                callback(result)
          
            }
        });
    }


}
module.exports = User;
