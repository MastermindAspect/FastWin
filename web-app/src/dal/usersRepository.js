const mysql = require("mysql")

const db = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB",
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
	db.query("SELECT * FROM hubs WHERE id in (SELECT hubId FROM posts WHERE userId = ? GROUP BY hubId ORDER BY COUNT(*) DESC LIMIT 3)"), [userId], function(err, hubs) {
		if (err) {
			console.log(err)
		} else {
			callback(hubs)
		}
	}
}

exports.createUser = function(username, email, password, callback) {
	const data = [username, password, email]
	db.query("INSERT INTO users (username, passHash, email) VALUES (?, ?, ?)", data, function(err) {
		callback(err)
	})
}

exports.getUserByUsername = function(username, callback) {
	db.query('SELECT * FROM users WHERE username = ?', [username], function(err, user) {
		callback(err, user[0])
	})
}

exports.getUserByEmail = function(email, callback) {
	db.query('SELECT * FROM users WHERE email = ?', [email], function(err, user) {
		callback(err, user[0])
	})
}
