const mysql = require("mysql")

const db = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB"
})

module.exports = function({}){
	return {
		getAllTournaments: function(callback){

			db.query("SELECT * FROM tournaments", function(error, tournaments){
				callback(tournaments, error);
			})
			
		},

		createTournament: function(userId, tournamentName, description, game, maxPlayers, callback){
            const values = [userId, tournamentName, description, game, maxPlayers]
			db.query("SELECT * FROM tournaments WHERE tournamentName = ?", values[1], function(err,tournament){
				if (tournament.length) callback(null,"Already a tournament with that name")
				else {
					db.query("INSERT INTO tournaments (userId,tournamentName, description, game, maxPlayers) VALUES (?,?,?,?,?)", values, function(err){
						if (err) callback(null, "Error creating tournament!")
						else {
							db.query("SELECT id FROM tournaments WHERE tournamentName = ?", values[1], function(err,tournament){
								if (err) callback(null, "error finding tournament")
								else {
									callback(tournament[0].id, null)
								}
							})
						}
					})
				}
			})
		},

		getTournament: function(tournamentId, callback){
			db.query("SELECT * FROM tournaments WHERE id = ?", tournamentId,function(err,tournamentResults){
				if (err) {
					callback(null, err)
				} else {
					callback(tournamentResults[0], null)
				}
			})
		},

		getTournamentPlayers: function(tournamentId, callback){
			db.query("SELECT u.* FROM tournaments t INNER JOIN tournament_info ti ON ti.tournamentId = t.id INNER JOIN users u ON u.id = ti.userId WHERE t.id = ?", [tournamentId], function(err, users){
				if (err) {
					callback(null, err)
				} else {
					callback(users, null)
				}
			})
		},

		getAllTournamentByUser: function(userId, callback){
			db.query("SELECT h.* FROM tournaments h INNER JOIN tournament_info hs ON hs.tournamentId = h.id INNER JOIN users u ON u.id = hs.userId WHERE u.id = ?", [userId], function(err, tournaments){
				if (err) {
					callback(null, err)
				} else {
					callback(tournaments, null)
				}
			})
		},

		joinTournament: function(tournamentId, userId, callback){
			db.query("INSERT INTO tournament_info (tournamentId, userId) VALUES (?,?)", [tournamentId, userId], function(err){
				if (err) {
					callback("Unable to join tournament!")
				} else {
					callback(null)
				}
			})
		},

		leaveTournament: function(tournamentId, userId, callback){
			db.query("DELETE FROM tournament_info WHERE tournamentId = ? AND userId = ?", [tournamentId, userId], function(err){
				if (err) {
					callback("Unable to leave tournament!")
				} else {
					callback(null)
				}
			})
		}
	}
}