const mysql = require("mysql")

const db = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB",
})


module.exports = function({}) {
	return {
		getAllUsers: function(callback) {
			db.query("SELECT * FROM users", function(error, users){
				if (error) {
					callback(null, error)
				} else {
					callback(users, null)
				}
			})
		},
		
		getUserById: function(userId, callback) {
			db.query("SELECT * FROM users WHERE id = ?", [userId], function(err, userResults) {
				if (err) {
					callback(null, err)
				} else {
					callback(userResults[0], null)
				}
			})
		},
		
		createUser: function(username, email, password, callback) {
			const data = [username, password, email]
			db.query("INSERT INTO users (username, passHash, email) VALUES (?, ?, ?)", data, function(err) {
				callback(err)
			})
		},
		
		getUserByUsername: function(username, callback) {
			db.query('SELECT * FROM users WHERE username = ?', [username], function(err, userResults) {
				if (err) {
					callback(null, err)
				} else {
					callback(userResults[0], null)
				}
			})
		},
		
		getUserByEmail: function(email, callback) {
			db.query('SELECT * FROM users WHERE email = ?', [email], function(err, userResults) {
				if (err) {
					callback(null, err)
				} else {
					callback(userResults[0], null)
				}
			})
		}
	}
}