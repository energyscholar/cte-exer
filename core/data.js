const database = require('./database');

function Data() {};

Data.prototype = {
    // Find the user data by id or username.
    find : function(user = null, callback)
    {
        // if the user variable is defined
        if(user) {
            // if user = number return field = id, if user = string return field = username.
            var field = Number.isInteger(user) ? 'id' : 'name';
        }
        // prepare the sql query
        let sql = `SELECT * FROM users WHERE ${field} = ?`;    

        database.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },
    create : function(body, callback){
        console.log("About to create data"); 
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }

        // Swap  out commented code once Passport is in place and user is defined
        // let sql = `INSERT INTO readings(id,systolic,diastolic,hr) VALUES (?, ?, ?, ?)`;
        let sql = `INSERT INTO readings(id,systolic,diastolic,hr) VALUES (1, ?, ?, ?)`; // Bruce: error!  Hardcoded user id!
        database.query(sql, bind, function(err, result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
    },
    read: function(data, callback){
       
        id = 1; // hardcoded id 
        // Modify to only current user's data: get from session
        //let sql= `SELECT * FROM data WHERE 0=0 AND id = ?`;
        let sql= `SELECT * FROM readings`;


        database.query(sql,data,function(err, result) {
            
            if(err) throw err

            if(result) {
                callback(result)          
            }
        });
    }

}
module.exports = Data;
