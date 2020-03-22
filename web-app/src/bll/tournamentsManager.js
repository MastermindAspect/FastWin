

module.exports = function({tournamentsRepository}){
	return {
		getAllTournaments: function(callback){
			tournamentsRepository.getAllTournaments(function(tournaments, error){
				if (error) {
					console.log(error)
					callback(null, "Error getting tournaments")
				} else {
					callback(tournaments, null)
				}
			})
		},

		createTournament: function(userId, tournamentName, description, game, maxPlayers, loggedIn, callback){
			errors = []
			if (tournamentName == "") {
				errors.push("Tournament must have a name")
			}
			if (description == "") {
				errors.push("Tournament must have a description")
			}
			if (game == "") {
				errors.push("Tournament must have a game")
			}
			if (maxPlayers == "") {
				errors.push("You need to specify max players for the tournament")
			}
			if (!loggedIn || !userId){
				errors.push("You need to be logged in to create a tournament")
			}
			if (errors.length == 0) {
				tournamentsRepository.createTournament(userId, tournamentName, description, game, maxPlayers, function(id, error){
					if (error) {
						callback(null, null, error)
					} else {
						callback(id, null, null)
					}
				})
			}else {
				callback(null, errors, null)
			}
		},

		getTournament: function(id, callback){
			tournamentsRepository.getTournament(id, function(tournament, error){
				if (error) {
					callback(null, "Error getting tournament")
				} else {
					callback(tournament, null)
				}
			})
		},

		joinTournament: function(tournamentId, loggedin, userId, callback){
			if (loggedin && userId){
				tournamentsRepository.getTournament(tournamentId, function(tournament, error){
					if (error) {
						callback(null, "Error getting tournament")
					} else {
						tournamentsRepository.getTournamentPlayers(tournamentId, function(users, error){
							if (error) {
								callback(null, "Error getting tournament-players")
							}
							if (users.length == tournament.maxPlayers) {
								callback("The tournament is full", null)
							}
							else{
								tournamentsRepository.joinTournament(tournamentId,userId, function(err){
									if (err) {
										callback(null, "Error joining tournament")
									} else {
										callback(null, null)
									}
								})
							}
						})
					}
				})
			}
			else {
				callback("You need to be logged in to join a tournament", null)
			}
		},

		leaveTournament: function(tournamentId, loggedin,userId, callback){
			if (loggedin && userId){
				tournamentsRepository.leaveTournament(tournamentId, userId, function(err){
					if (err) {
						callback(null, "Error leaving tournament")
					} else {
						callback(null, null)
					}
				})
			}
			else {
				callback("You need to be logged in to leave a tournament", null)
			}
		},

		getTournamentPlayers: function(tournamentId, callback){
			tournamentsRepository.getTournamentPlayers(tournamentId, function(users, err){
				if (err) {
					callback(null, "Error getting tournament-players")
				} else {
					callback(users, null)
				}
			})
		},

		getAllTournamentByUser: function(userId, loggedin,callback){
			if (loggedin && userId){
				tournamentsRepository.getAllTournamentByUser(userId, function(tournaments, error){
					if (error) {
						callback(null, null, "Error getting tournaments")
					}
					else {
						plainTournaments = []
						for (tournament in tournaments) {
							plainTournaments.push(tournaments[tournament].dataValues)		//Vrf funkar denna på detta sättet?? (som den utkommenterade loopen)
						}
						callback(plainTournaments, null, null)
					}
				})
			}
			else{
				callback(null, "You need to be logged in to view all hubs", null)
			}
		},

		isJoined: function(tournamentId, userId, callback){
			tournamentsRepository.getTournamentPlayers(tournamentId, function(players, error) {
				if (error) {
					callback(null, error)
				} else {
					let participating = false
					for (player in players) {
						if (players[player].id == userId) {       //Vrf funkar det såhär? players[player].id och inte bara sub.id?
							participating = true
						}
					}
					callback(participating, null)
				}
			})
		}
	}
}