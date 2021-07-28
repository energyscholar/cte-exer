const database = require('./database');

function Data() {};

Data.prototype = {

    create : function(body, callback){
    // Create a new health record of diastolic, systolic, and heart rate associated with currently logged-in user by id 
        var bind = [];
        // loop over the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // we got id from session earlier
        let sql = `INSERT INTO readings(id,systolic,diastolic,hr) VALUES (?, ?, ?, ?)`; 
        database.query(sql, bind, function(err, result) {
            if(err) throw err;
            // return the last inserted id. 
            callback(result.insertId);
        });
    },

    read: function(data, userid, callback){
       // Read data from readings table, careful to get only data associated with logged in user id.
        id = userid; 
        // Modify to only current user's data: get from session
        //let sql= `SELECT * FROM data WHERE 0=0 AND id = ?`;
        let sql= `SELECT * FROM readings WHERE id = ${userid}`;
        database.query(sql,data,function(err, result) {            
            if(err) throw err
            if(result) {
                callback(result)          
            }
        });
    }
}
module.exports = Data;
