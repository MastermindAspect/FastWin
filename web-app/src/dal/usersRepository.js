const mysql = require("mysql")

const db = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB"
})

exports.getAllUsers = function(callback) {
    db.query("SELECT * FROM users", function(error, users){
		callback(users)
	})
}

exports.getUserById = function(userId, callback) {
	db.query("SELECT * FROM users WHERE id = ?", [userId], function(err, user) {
		if (err) {
			console.log(err)
		} else {
			callback(user[0])
		}
	})
}

exports.getMostUsedHubs = function(userId, callback) {
	db.query("SELECT * FROM hubs WHERE id in (SELECT hubsId FROM posts WHERE userId = ? GROUP BY hubsId ORDER BY COUNT(*) DESC LIMIT 3)"), [userId], function(err, hubs) {
		if (err) {
			console.log(err)
		} else {
			callback(hubs)
		}
	}
}