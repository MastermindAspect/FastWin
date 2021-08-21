module.exports = function({db}){
	return {
		getAllHubs: function(callback){
			db.Hub.findAll({raw: true})
				.then(function(hubs) {
					callback(hubs, null)
				})
				.catch(function(error) {
					callback(null, "Error getting hubs")
				})
		},
		createHub: function(userId, hubName, description, game, callback){
			db.Hub.create({userId: userId, hubName: hubName, description: description, game: game})
                .then(function(hub){
                    callback(hub.dataValues.id, null)
                })
                .catch(function(error) {
                    if (error = "SequelizeUniqueConstraintError: Validation error") {
						callback(null, "Already a hub with that name")
					} else {
						callback(null, "Error updating hub")
					}
                })
		},

		getHub: function(id, callback){
			db.Hub.findByPk(id)
				.then(function(hub){
					if (hub) {
						callback(hub.dataValues, null)
					} else {
						callback(null, null)
					}
				})
				.catch(function(error){
					callback(null, "Error getting hub")
				})
		},

		deleteHub: function(hubId, callback) {
			db.Hub.destroy({
				where: {id: hubId}
			})
				.then(function(){
					callback(null)
				})
				.catch(function(error){
					callback("Error deleting hub")
				})
		},


		updateHub: function(hubId, hubName, description, game, callback) {
			db.Hub.update({
				hubName: hubName,
				description: description,
				game: game
			}, {
				where: {id: hubId}
			})
				.then(function(){
					callback(null)
				})
				.catch(function(error) {
					if (error = "SequelizeUniqueConstraintError: Validation error") {
						callback("Already a hub with that name")
					} else {
						callback("Error updating hub")
					}
					
				})
		},

		subscribeTo: function(hubId, userId, callback){
			db.Hub.findOne({
				where: {id: hubId},
				include: [{
					model: db.User,
					as: "Subscribers"
				}]
			})
				.then(function(hub){
					db.User.findByPk(userId)
						.then(function (user) {
							hub.addSubscriber(user)
								.then(function () {
									callback(null)
								})
								.catch(function (error) {
									console.log("Error1:" + error)
									callback("Error subscribing to hub")
								})
						})
						.catch(function (error) {
							console.log("Error1:" + error)
							callback("Error subscribing to hub")
						})
				})
				.catch(function(error){
					console.log("Error1:" + error)
					callback(null, "Error subscribing to hub")
				})
		},
		unSubscribeTo: function(hubId, userId, callback){
			db.Hub.findOne({
				where: {id: hubId},
				include: [{
					model: db.User,
					as: "Subscribers"
				}]
			})
				.then(function(hub){
					db.User.findByPk(userId)
						.then(function (user) {
							hub.removeSubscriber(user)
								.then(function () {
									callback(null)
								})
								.catch(function (error) {
									console.log("Error1:" + error)
									callback("Error unsubscribing to hub")
								})
						})
						.catch(function (error) {
							console.log("Error2:" + error)
							callback("Error unsubscribing to hub")
						})
				})
				.catch(function(error){
					console.log("Error3:" + error)
					callback(null, "Error unsubscribing to hub")
				})
		},
		getMembers: function(hubId, callback){
			db.Hub.findOne({
				where: {id: hubId},
				include: [{
					model: db.User,
					as: "Subscribers"
				}]
			})
			.then(function(hub){
				const plainUsers = []
				const subscribers = hub.Subscribers
				for (user in subscribers) {
					plainUsers.push(subscribers[user].dataValues)
				}
				callback(plainUsers, null)
			})
			.catch(function(error){
				callback(null, "Error getting members")
			})
		},
		getAllHubsByUser: function(userId, callback){
			db.User.findOne({
				where: {id: userId},
				include: [{
					model: db.Hub,
					as: "Subscriptions"
				}]
			})
			.then(function(user){
				plainHubs = []
				for (hub in user.Subscriptions) {
					plainHubs.push(user.Subscriptions[hub].dataValues)
				}
				callback(plainHubs, null)
			})
			.catch(function(error){
				callback(null, "Error getting hubs by user")
			})
	 	}
	}
}

