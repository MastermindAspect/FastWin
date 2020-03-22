const mysql = require("mysql")

const db1 = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB",
})



module.exports = function({db}) {
	return {
		getAllUsers: function(callback) {
			db.User.findAll({raw: true})
				.then(function(users) {
					callback(users, null)
				})
				.catch(function(error) {
					callback(null, error)
				})
		},
		
		getUserById: function(userId, callback) {
            db.User.findByPk(userId)
            	.then(function(user){
					if (user) {
						callback(user.dataValues, null)
					} else {
						callback(null, null)
					}
            	})
            	.catch(function(error) {
                	callback(null, error)
            	})
		},
		
		createUser: function(username, email, password, callback) {
			const passHash = password
            db.User.create({username: username, passHash: passHash, email: email})
                .then(function() {
					callback(null)
                })
                .catch(function(error) {
                    callback(error)
                })
		},
		
		getUserByUsername: function(username, callback) {
			db.User.findOne({
				where: {username: username}
			})
				.then(function(user) {
					if (user) {
						callback(user.dataValues, null)
					} else {
						callback(null, null)
					}
				})
				.catch(function(error) {
					callback(null, error)
				})
		},
		
		getUserByEmail: function(email, callback) {
			db.User.findOne({
                where: {email: email}
            })
                .then(function(user){
					if (user) {
						callback(user.dataValues, null)
					} else {
						callback(null, null)
					}
                })
                .catch(function(error){
                    callback(null, error)
                })
		}
	}
}