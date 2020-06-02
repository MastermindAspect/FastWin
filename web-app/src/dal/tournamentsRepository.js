const mysql = require("mysql")

const db1 = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB"
})

//const db = require('../dal/sequelizeSetup')

module.exports = function({db}){
	return {
		getAllTournaments: function(callback){
			db.Tournament.findAll({raw: true})
				.then(function(tournaments) {
					callback(tournaments, null)
				})
				.catch(function(error){
					callback(null, error)
				})
		},

		createTournament: function(userId, tournamentName, description, game, maxPlayers, callback){
			db.Tournament.create({userId: userId, tournamentName: tournamentName, description: description, game: game, maxPlayers: maxPlayers})
                .then(function(tournament){
                    callback(tournament.dataValues.id)
                })
                .catch(function(error) {
                    callback(error)
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
					callback(null, error)
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
				callback(null, error)
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
				const plainTournaments = []
				const participations = user.Participation
				for (tournament in participations) {
					plainTournaments.push(participations[tournament].dataValues)
				}
				callback(user.Participation, null)		//Ska denna ligga i user repository istället?
			})
			.catch(function(error){
				callback(null, error)
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
									callback(error)
								})
						})
						.catch(function (error) {
							callback(error)
						})
				})
				.catch(function(error){
					callback(null, error)
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
									callback(error)
								})
						})
						.catch(function (error) {
							callback(error)
						})
				})
				.catch(function(error){
					callback(null, error)
				})
		}

	}
}