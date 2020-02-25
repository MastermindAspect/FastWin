const express = require("express");


module.exports = function({tournamentsManager}){
	const router = express.Router()
	router.get("/all", function(req,res){
		try {
			tournamentsManager.getAllTournaments(function(tournaments){
				const model = {
					title: "All tournaments",
					tournaments
				}
				res.render("tournaments_all.hbs", model);
			})
		} catch (error){
			const model = {
				error
			}
			res.render("error.hba", model);
		}
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
		try {
			tournamentsManager.createTournament([req.session.userId,tournamentName,description,game,maxPlayers, "1-1-1-1"],req.session.loggedIn, function(id){
				res.redirect("/tournaments/"+id);
			})
		} catch(error){
			const model = {error}
			res.render("error.hbs", model)
		}
	})	

	router.get("/:id", function(req,res){
		const id = req.params.id;
		try{
			tournamentsManager.getTournament(id,function(tournament){
				tournamentsManager.isJoined(id,req.session.userId,function(joined){
					const model = {title: "tournament"+tournament.id, tournament,joined}
					res.render("tournaments_tournament.hbs", model);
				})
			})
		}
		catch(error){
			const model = {error}
			res.render("error.hbs", model)
		}
	})

	router.post("/:id/join", function(req,res){
		const tournamentId = req.params.id;
		try{
			tournamentsManager.joinTournament(tournamentId, req.session.loggedIn,req.session.userId)
			res.redirect("/tournaments/"+tournamentId)
		}
		catch(error){
			const model = {error}
			res.render("error.hbs", model);
		}
	})

	router.post("/:id/leave", function(req,res){
		const tournamentId = req.params.id;
		try{
			tournamentsManager.leaveTournament(tournamentId, req.session.loggedIn,req.session.userId)
			res.redirect("/tournaments/"+tournamentId)
		}
		catch(error){
			const model = {error}
			res.render("error.hbs", model)
		}
	})

	router.get("/:id/players", function(req,res){
		const tournamentId = req.params.id;
		try{
			tournamentsManager.getTournamentPlayers(tournamentId, function(users){
				const model = {title: "Players", users}
				res.render("tournaments_players.hbs", model)
			})
		}
		catch(error){
			const model = {error}
			res.render("error.hbs", model)
		}
	})
	return router
}
