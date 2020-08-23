sequelize = require('sequelize')

module.exports = function({db}) {
	return {
		getAllUsers: function(callback) {
			db.User.findAll({raw: true})
				.then(function(users) {
					callback(users, null)
				})
				.catch(function(error) {
					callback(null, "Error getting users")
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
                	callback(null, "Error getting user")
            	})
		},
		
		createUser: function(username, email, password, callback) {
			const passHash = password
            db.User.create({username: username, passHash: passHash, email: email})
                .then(function() {
					callback(null)
                })
                .catch(function(error) {
					if (error instanceof sequelize.UniqueConstraintError) {
						callback("Username is already in use")
					} else {
						callback("Error creating user")
					}
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
					callback(null, "Error getting user")
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
            	    callback(null, "Error getting user")
            	})
		}
	}
}