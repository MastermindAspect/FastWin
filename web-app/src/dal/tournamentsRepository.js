module.exports = function({db}){
	return {
		getAllTournaments: function(callback){
			db.Tournament.findAll({raw: true})
				.then(function(tournaments) {
					callback(tournaments, null)
				})
				.catch(function(error){
					callback(null, "Error getting tournaments")
				})
		},

		createTournament: function(userId, tournamentName, description, game, maxPlayers, callback){
			db.Tournament.create({userId: userId, tournamentName: tournamentName, description: description, game: game, maxPlayers: maxPlayers})
                .then(function(tournament){
                    callback(tournament.dataValues.id, null)
                })
                .catch(function(error) {
                    if (error = "SequelizeUniqueConstraintError: Validation error") {
						callback(null, "Already a hub with that name")
					} else {
						callback(null, "Error updating hub")
					}
                })
		},

		getTournament: function(tournamentId, callback){
			db.Tournament.findByPk(tournamentId)
				.then(function(tournament) {
					if (tournament) {
						callback(tournament.dataValues, null)
					} else {
						callback(null, null)
					}
				})
				.catch(function(error) {
					callback(null, "Error getting torunament")
				})
		},

		getTournamentPlayers: function(tournamentId, callback){
			db.Tournament.findOne({
				where: {id: tournamentId},
				include: [{
					model: db.User,
					as: "Players"
				}]
			})
			.then(function(tournament){
				const plainUsers = []
				const players = tournament.Players
				for (user in players) {
					plainUsers.push(players[user].dataValues)
				}
				callback(plainUsers, null)
			})
			.catch(function(error){
				callback(null, "Error getting players")
			})
		},

		getAllTournamentByUser: function(userId, callback){
			db.User.findOne({
				where: {id: userId},
				include: [{
					model: db.Tournament,
					as: "Participation"
				}]
			})
			.then(function(user){
				plainTournaments = []
				for (tournament in user.Participation) {
					plainTournaments.push(user.Participation[tournament].dataValues)		//Vrf funkar denna på detta sättet?? (som den utkommenterade loopen)
				}
				callback(plainTournaments, null)
			})
			.catch(function(error){
				callback(null, "Error getting tournaments")
			})
		},

		joinTournament: function(tournamentId, userId, callback){
			db.Tournament.findOne({
				where: {id: tournamentId},
				include: [{
					model: db.User,
					as: "Players"
				}]
			})
				.then(function(hub){
					db.User.findByPk(userId)
						.then(function (user) {
							hub.addPlayer(user)
								.then(function () {
									callback(null)
								})
								.catch(function (error) {
									callback("Error joining tournament")
								})
						})
						.catch(function (error) {
							callback("Error joining tournament")
						})
				})
				.catch(function(error){
					callback(null, "Error joining tournament")
				})
		},

		leaveTournament: function(tournamentId, userId, callback){
			db.Tournament.findOne({
				where: {id: tournamentId},
				include: [{
					model: db.User,
					as: "Players"
				}]
			})
				.then(function(hub){
					db.User.findByPk(userId)
						.then(function (user) {
							hub.removePlayer(user)
								.then(function () {
									callback(null)
								})
								.catch(function (error) {
									callback("Error leaving tournament")
								})
						})
						.catch(function (error) {
							callback("Error leaving tournament")
						})
				})
				.catch(function(error){
					callback(null, "Error leaving tournament")
				})
		}

	}
}