

module.exports = function({tournamentsRepository}){
	return {
		getAllTournaments: function(callback){
			tournamentsRepository.getAllTournaments(function(tournaments, error){
				if (error) throw "unable to get tournaments"
				else callback(tournaments)
			})
		},

		createTournament: function(values, loggedin,callback){
			if (loggedin){
				tournamentsRepository.createTournament(values, function(id, error){
					if (error) throw error
					else callback(id)
				})
			}else {
				throw "Please login to create a tournament!"
			}
		},

		getTournament: function(id, callback){
			tournamentsRepository.getTournament(id, function(tournament){
				callback(tournament)
			})
		},

		joinTournament: function(tournamentId, loggedin,userId){
			if (loggedin && userId){
				tournamentsRepository.joinTournament(tournamentId,userId, function(err){
					if (err) throw err
				})
			}
			else {
				throw "Please login to join a tournament!"
			}
		},

		leaveTournament: function(tournamentId, loggedin,userId){
			if (loggedin && userId){
				tournamentsRepository.leaveTournament(tournamentId, userId, function(err){
					if (err) throw "could not leave tournament"
				})
			}
			else {
				throw "Could not leave tournament!"
			}
		},

		getTournamentPlayers: function(tournamentId, callback){
			tournamentsRepository.getTournamentPlayers(tournamentId, function(users, err){
				if (err) throw "error getting players"
				else callback(users)
			})
		},

		getAllTournamentByUser: function(userId, loggedin,callback){
			if (loggedin && userId){
				tournamentsRepository.getAllTournamentByUser(userId, function(tournaments, error){
					if (error) throw "unable to get tournaments"
					else callback(tournaments)
				})
			}
			else{
				throw "Please login to view hubs!"
			}
		},

		isJoined: function(tournamentId, userId, callback){
			tournamentsRepository.isJoined(tournamentId, userId,function(joined){
				callback(joined)

			})

		}
	}
}