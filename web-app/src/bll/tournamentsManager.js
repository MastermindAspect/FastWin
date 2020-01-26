const tournamentsRepository = require('../dal/tournamentsRepository')

exports.getAllTournaments = function(callback){
	tournamentsRepository.getAllTournaments(function(tournaments, error){
		// TODO: Also handle errors.
		if (error) throw "unable to get tournaments"
		else callback(tournaments)
	})
}

exports.createTournament = function(values, callback){
	//check if user is logged in
	//eles throw exception
	tournamentsRepository.createTournament(values, function(id, error){
		if (error) throw "unable to create tournament!"
		else callback(id)
	})
}

exports.getTournament = function(id, callback){
	//check if user is logged in
	//eles throw exception
	tournamentsRepository.getTournament(id, function(tournament){
		console.log("data from manager" + tournament)
		callback(tournament)
	})
}

exports.joinTournament = function(tournamentId, userId){
	//check if user is logged in
	//eles throw exception
	tournamentsRepository.joinTournament(tournamentId,userId, function(err){
		if (err) throw "could not join tournament"
	})
}

exports.leaveTournament = function(tournamentId, userId){
	//check if user is logged in
	//eles throw exception
	tournamentsRepository.leaveTournament(tournamentId, userId, function(err){
		if (err) throw "could not leave tournament"
	})
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

exports.getAllTournamentByUser = function(userId, callback){
    tournamentsRepository.getAllTournamentByUser(userId, function(tournaments, error){
		if (error) throw "unable to get tournaments"
		else callback(tournaments)
	})
}