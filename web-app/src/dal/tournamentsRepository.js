const mysql = require("mysql")

const db = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB"
})
exports.getAllTournaments = function(callback){

	db.query("SELECT * FROM tournaments", function(error, tournaments){
		// TODO: Also handle errors.
		callback(tournaments, error);
	})
	
}

exports.createTournament = function(values, callback){
	db.query("INSERT INTO tournaments (ownerId,tournamentName, description, game, maxPlayers,creationDate) VALUES (?,?,?,?,?)", values, function(err){
        //handle error
        console.log(err)
        if (err) callback(null, err)
    })
    db.query("SELECT id FROM tournaments WHERE tournamentName = ?", values[0], function(err,id){
        //handle error
        console.log(id)
        callback(id[0].id, err)
    })
}


exports.getTournament = function(tournamentId, callback){
	db.query("SELECT * FROM tournaments WHERE id = ?", tournamentId,function(err,tournament){
		callback(tournament[0],err)
	})
}

exports.getTournamentPlayers = function(tournamentId, callback){
    db.query("SELECT u.* FROM tournaments t INNER JOIN tournament_info ti ON ti.tournamentId = t.id INNER JOIN users u ON u.id = ti.id WHERE t.id = ?", [tournamentId], function(users, err){
        callback(users[0],err)
    })
}

exports.getAllTournamentByUser = function(userId, callback){
    db.query("SELECT t.* FROM tournaments t INNER JOIN tournament_info ti ON ti.tournamentId = t.id INNER JOIN users u ON u.id = ti.id WHERE u.id = ?", [userId], function(tournaments, err){
        callback(tournaments[0],err)
    })
}

exports.joinTournament = function(tournamentId, userId){
	db.query("INSERT INTO tournament_info (tournamentId, userId) VALUES (?,?)", [tournamentId, userId], function(err){
		callback(err)
	})
}

exports.leaveTournament = function(tournamentId, userId){
	db.query("DELETE FROM tournament_info WHERE tournamentId = ? AND userId = ?", [tournamentId, userId], function(err){
		callback(err)
	})
}