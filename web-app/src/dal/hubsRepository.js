const mysql = require("mysql")

const db1 = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB"
})

const db = require('../dal/sequelizeSetup')

module.exports = function({db}){
	return {
		getAllHubs: function(callback){
			db.Hub.findAll({raw: true})
				.then(function(hubs) {
					callback(hubs, null)
				})
				.catch(function(error) {
					callback(null, error)
				})
		},
		createHub: function(userId, hubName, description, game, callback){
			db.Hub.create({userId: userId, hubName: hubName, description: description, game: game})
                .then(function(hub){
                    callback(hub.dataValues.id, null)
                })
                .catch(function(error) {
                    callback(null, error)
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
					callback(null, error)
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
					callback(error)
				})
		},

		updateHub: function(hubId, hubName, description, game) {
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
					callback(error)
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
									callback(error)
								})
						})
						.catch(function (error) {
							console.log("Error1:" + error)
							callback(error)
						})
				})
				.catch(function(error){
					console.log("Error1:" + error)
					callback(null, error)
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
									callback(error)
								})
						})
						.catch(function (error) {
							console.log("Error2:" + error)
							callback(error)
						})
				})
				.catch(function(error){
					console.log("Error3:" + error)
					callback(null, error)
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
				callback(null, error)
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
				callback(user.Subscriptions, null)		//Ska denna ligga i user repository istället?
			})
			.catch(function(error){
				console.log(error)
				callback(null, error)
			})
	 	}
	}
}

