const mysql = require("mysql")

const db = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB"
})
exports.getAllHubs = function(callback){
	
	db.query("SELECT * FROM hubs", function(error, hubs){
		// TODO: Also handle errors.
		if (!error) {
			console.log(hubs)
			callback(hubs)
		} else {throw "Failed to get hubs!"}
	})
	
}

exports.createHub = function(values, loggedin, callback){
	db.query("INSERT INTO hubs (hubName, description, game, creationDate) VALUES (?,?,?,?)", values, function(err){
		//handle error
		callback(null, err)
	})
	db.query("SELECT id FROM hubs WHERE hubName = ?", values[0], function(err,id){
		//handle error
		callback(id[0].id, err)
	})
}


exports.getHub = function(id, callback){
	db.query("SELECT * FROM hubs WHERE id = ?", id,function(err,hub){
		callback(hub[0],err)
	})
}


exports.subscribeTo = function(hubId, userId, clalback){
	db.query("INSERT INTO hub_subscriptions (hubId, userId) VALUES (?,?)", [hubId, userId], function(err){
		callback(err)
	})
}

exports.unSubscribeTo = function(hubId, userId){
	db.query("DELETE FROM hub_subscriptions WHERE hubId = ? AND userId = ?", [hubId, userId], function(err){
		callback(err)
	})
}

exports.getMembers = function(hubId, callback){
	db.query("SELECT u.* FROM hubs h INNER JOIN hub_subscriptions hs ON hs.tournamentId = h.id INNER JOIN users u ON u.id = hs.id WHERE h.id = ?", [hubId], function(users, err){
		callback(users[0],err)
	})
}

exports.getAllHubsByUser = function(userId, callback){
	db.query("SELECT h.* FROM hubs h INNER JOIN hub_subscriptions hs ON hs.tournamentId = h.id INNER JOIN users u ON u.id = hs.id WHERE u.id = ?", [userId], function(hubs, err){
		callback(hubs[0],err)
	})
}