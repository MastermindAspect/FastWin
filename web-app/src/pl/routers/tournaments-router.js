const express = require("express");


module.exports = function({tournamentsManager}){
	const router = express.Router()
	router.get("/all", function(req,res){
		tournamentsManager.getAllTournaments(function (tournaments, dbError) {
			if (dbError) {
				const model = {
					error: [dbError]
				}
				res.render("error.hba", model);
			} else {
				const model = {
					title: "All tournaments",
					allTournaments: tournaments
				}
				res.render("tournaments_all.hbs", model);
			}
		})
	})

	router.get("/create", function(req,res){
		const model = {title: "Create Tournament"}
		res.render("tournaments_create.hbs", model);
	})

	router.post("/create", function(req,res){
		const tournamentName = req.body.tournament_name;
		const description = req.body.description;
		const game = req.body.game;
		const maxPlayers = req.body.max_players;
		tournamentsManager.createTournament(req.session.userId, tournamentName, description, game, maxPlayers, req.session.loggedIn, function (id, errors, dbError) {
			if (dbError) {
				const model = {
					error: [dbError]
				}
				res.render("error.hbs", model)
			} else if (errors) {
				const model = {
					title: "Create Tournament",
					tournamentName,
					description,
					game,
					maxPlayers,
					errors
				}
				res.render("tournaments_create.hbs", model);
			} else {
				res.redirect("/tournaments/" + id);
			}
		})
	})	

	router.get("/:id", function(req,res){
		const id = req.params.id;
		tournamentsManager.getTournament(id, function (tournament, dbError1) {
			tournamentsManager.isJoined(id, req.session.userId, function (joined, dbError2) {
				if (dbError1 || dbError2) {
					const model = {
						error: [dbError1, dbError2]
					}
					res.render("error.hbs", model)
				} else {
					console.log(joined)
					const model = {
						title: "tournament" + tournament.id, 
						tournament,
						joined
					}
					res.render("tournaments_tournament.hbs", model);
				}
			})
		})
	})

	router.post("/:id/join", function(req,res){
		const tournamentId = req.params.id;
		tournamentsManager.joinTournament(tournamentId, req.session.loggedIn,req.session.userId, function(error, dbError) {
			if (dbError) {
				const model = {
					error: [dbError]
				}
				res.render("error.hbs", model);
			} else if (error) {
				const model = {
					error
				}
				res.render("error.hbs", model);
			} else {
				res.redirect("/tournaments/"+tournamentId)
			}
		})
	})

	router.post("/:id/leave", function(req,res){
		const tournamentId = req.params.id;
		tournamentsManager.leaveTournament(tournamentId, req.session.loggedIn, req.session.userId, function(error, dbError) {
			if (dbError) {
				const model = {
					error: [dbError]
				}
				res.render("error.hbs", model)
			} else if (error) {
				const model = {
					error
				}
				res.render("error.hbs", model)
			} else {
				res.redirect("/tournaments/" + tournamentId)
			}
		})
	})

	router.get("/:id/players", function(req,res){
		const tournamentId = req.params.id;
		tournamentsManager.getTournamentPlayers(tournamentId, function (users, dbError) {
			if (dbError) {
				const model = {
					error: [dbError]
				}
				res.render("error.hbs", model)
			} else {
				const model = { title: "Players", users }
				res.render("tournaments_players.hbs", model)
			}
		})
	})
	return router
}
