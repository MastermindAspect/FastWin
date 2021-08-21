const mysql = require("mysql")

const db = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB"
})

module.exports = function({}){
	return {
		getAllHubs: function(callback){
			db.query("SELECT * FROM hubs", function(error, hubs){
				if (error) {
					callback(null, error)
				} else {
					callback(hubs, null)
				}
			})
		},
		createHub: function(userId, hubName, description, game, callback){
			const values = [userId, hubName, description, game, "1-1-1-1"]
			db.query("SELECT * FROM hubs WHERE hubName = ?", values[1], function(err,hubResults){
				if (hubResults[0]) callback(null,"Already a hub with that name")
				else {
					db.query("INSERT INTO hubs (userId, hubName, description, game, creationDate) VALUES (?,?,?,?,?)", values, function(err){
						if (err) callback(null, "Error creating hub!")
						else {
							db.query("SELECT id FROM hubs WHERE hubName = ?", values[1], function(err,hub){
								if (err) callback(null, "Error finding hub")
								else {
									db.query("INSERT INTO hub_subscriptions (hubId, userId) VALUES (?,?)", [hub[0].id, values[0]], function(err){
										if (err) callback("Error subscribing")
										else callback(hub[0].id, null)
									})
								}
							})
						}
					})
				}
			})
		},
		getHub: function(id, callback){
			db.query("SELECT * FROM hubs WHERE id = ?", id,function(err,hubResults){
				if (err) {
					callback(null, err)
				} else {
					callback(hubResults[0], null)
				}
			})
		},
		deleteHub: function(hubId, callback) {
			db.query("DELETE FROM hubs WHERE id = ?", hubId, function(err) {
				callback(err)
			})
		},
		updateHub: function(hubId, hubName, description, game, callback) {
			const data = [hubName, description, game, hubId]
			db.query("UPDATE hubs SET hubName = ?, description = ?, game = ? WHERE id = ?", data, function(err) {
				callback(err)
			})
		},
		subscribeTo: function(hubId, userId, callback){
			db.query("SELECT hubId FROM hub_subscriptions WHERE hubId = ? AND userId = ?", [hubId, userId], function(err, userList){
				console.log(userId,hubId)
				if (!userList.length) {
					db.query("INSERT INTO hub_subscriptions (hubId, userId) VALUES (?,?)", [hubId, userId], function(err){
						if (err) {
							console.log(err)
							callback("Error subscribing")
						} else {
							callback(null)
						}
					})
				}
				else callback("Already subscribed")
			})
		},
		unSubscribeTo: function(hubId, userId, callback){
			db.query("SELECT * FROM hub_subscriptions WHERE hubId = ? AND userId = ?", [hubId, userId], function(err, userList){
				console.log("data",userId,hubId)
				if (userList.length){
					db.query("DELETE FROM hub_subscriptions WHERE hubId = ? AND userId = ?", [hubId, userId], function(err){
						if (err) {
							callback("Could not unsubscribe!")
						} else {
							callback(null)
						}
					})
				} else {
					callback("Not subscribed!")
				}
			})
		},
		getMembers: function(hubId, callback){
			db.query("SELECT u.* FROM hubs h INNER JOIN hub_subscriptions hs ON hs.hubId = h.id INNER JOIN users u ON u.id = hs.userId WHERE h.id = ?", [hubId], function(err, users){
				if (err) {
					callback(null, err)
				} else {
					callback(users, null)
				}
			})
		},
		getAllHubsByUser: function(userId, callback){
			db.query("SELECT h.* FROM hubs h INNER JOIN hub_subscriptions hs ON hs.hubId = h.id INNER JOIN users u ON u.id = hs.userId WHERE u.id = ?", [userId], function(err, hubs){
				if (err) {
					callback(null,err)
				} else {
					callback(hubs,null)
				}
			})
		}
	}
}