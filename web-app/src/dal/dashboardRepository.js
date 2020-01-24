
const mysql = require("mysql")

const db = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB"
})

exports.getDashboardContent = function(userId, callback){
    db.query("SELECT * FROM subscriptions WHERE userId = ?", userId, function(err,subs){
        let hubs = []
        for(sub of subs[0]){
            db.query("SELECT * FROM hubs WHERE id = ?", sub.hubId, function(err,hub){
                hubs.push(hub);
            })
        }
        callback(hubs)
    })

}