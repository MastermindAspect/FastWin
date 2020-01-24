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
		} else throw "Failed to get hubs!"
	})
	
}

exports.createHub = function(values, callback){
	db.query("INSERT INTO hubs (hubName, description, game, creationDate) VALUES (?,?,?,?)", values, function(err){
		//handle error
		console.log(err)
	})
	db.query("SELECT id FROM hubs WHERE hubName = ?", values[0], function(err,id){
		//handle error
		callback(id[0].id)
	})
}


exports.getHub = function(id, callback){
	db.query("SELECT * FROM hubs WHERE id = ?", id,function(err,hub){
		if (err) throw "Could not get the specific hub!"
		else {
			callback(hub[0])
		}
	})
}


exports.subscribeTo = function(hubId, userId){
	db.query("INSERT INTO subscriptions (hubId, userId) VALUES (?,?)", [hubId, userId], function(err){
		if (err) return false
		else return true
	})
}