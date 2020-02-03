const tournamentsRepository = require('../dal/tournamentsRepository')

exports.getAllTournaments = function(callback){
	tournamentsRepository.getAllTournaments(function(tournaments, error){
		if (error) throw "unable to get tournaments"
		else callback(tournaments)
	})
}

exports.createTournament = function(values, loggedin,callback){
	if (loggedin){
		tournamentsRepository.createTournament(values, function(id, error){
			if (error) throw "unable to create tournament!"
			else callback(id)
		})
	}else {
		throw "Please login to create a tournament!"
	}
}

exports.getTournament = function(id, callback){
	tournamentsRepository.getTournament(id, function(tournament){
		callback(tournament)
	})
}

exports.joinTournament = function(tournamentId, loggedin,userId){
	if (loggedin && userId){
		tournamentsRepository.joinTournament(tournamentId,userId, function(err){
			if (err) throw "could not join tournament"
		})
	}
	else {
		throw "Please login to join a tournament!"
	}
}

exports.leaveTournament = function(tournamentId, loggedin,userId){
	if (loggedin && userId){
		tournamentsRepository.leaveTournament(tournamentId, userId, function(err){
			if (err) throw "could not leave tournament"
		})
	}
	else {
		throw "Could not leave tournament!"
	}
}

exports.getTournamentPlayers = function(tournamentId, callback){
	tournamentsRepository.getTournamentPlayers(tournamentId, function(users, err){
		if (err) throw "error getting players"
		else callback(users)
	})
}

exports.getTournamentPlayers = function(userId, callback){
	tournamentsRepository.getAllTournamentByUser(userId, function(tournaments, err){
		if (err) throw "error getting players"
		else callback(tournaments)
	})
}

exports.getAllTournamentByUser = function(userId, loggedin,callback){
	if (loggedin && userId){
		tournamentsRepository.getAllTournamentByUser(userId, function(tournaments, error){
			if (error) throw "unable to get tournaments"
			else callback(tournaments)
		})
	}
	else{
		throw "Please login to view hubs!"
	}
}