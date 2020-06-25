const express = require("express");
const redis = require("redis");
const redisClient = redis.createClient({host: 'redis', port: 6379});

module.exports = function({tournamentsManager, authentication}){
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

	router.post("/create", authentication.authenticateToken, function(req,res){
		const tournamentName = req.body.tournament_name;
		const description = req.body.description;
		const game = req.body.game;
		const maxPlayers = req.body.max_players;
		redisClient.get("userId", function(err,reply){
			try {
				tournamentsManager.createTournament([reply,tournamentName,description,game,maxPlayers, "1-1-1-1"],true, function(id){
					res.redirect("/tournaments/"+id);
				})
			} catch(error){
				const model = {error}
				res.render("error.hbs", model)
			}
		})
	})	

	router.get("/:id", function(req,res){
		const id = req.params.id;
		redisClient.get("userId", function(err,reply){
			try{
				tournamentsManager.getTournament(id,function(tournament){
					tournamentsManager.isJoined(id,reply,function(joined){
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
	})

	router.post("/:id/join",authentication.authenticateToken, function(req,res){
		const tournamentId = req.params.id;
		redisClient.get("userId", function(err,reply){
			try{
				tournamentsManager.joinTournament(tournamentId, true,reply)
				res.redirect("/tournaments/"+tournamentId)
			}
			catch(error){
				const model = {error}
				res.render("error.hbs", model);
			}
		})
	})

	router.post("/:id/leave",authentication.authenticateToken, function(req,res){
		const tournamentId = req.params.id;
		redisClient.get("userId", function(err,reply){
			try{
				tournamentsManager.leaveTournament(tournamentId, true,reply)
				res.redirect("/tournaments/"+tournamentId)
			}
			catch(error){
				const model = {error}
				res.render("error.hbs", model)
			}
		})
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
