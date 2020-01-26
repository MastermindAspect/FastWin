const express = require("express");
const router = express.Router();
const tournamentsManager = require('../../bll/tournamentsManager')

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
	tournamentsManager.getAllTournaments(function(tournaments){
		const model = {title: "Create", tournaments}
		res.render("tournaments_create", model);
	})
})

router.post("/create", function(req,res){
	const tournamentName = req.body.tournament_name;
	const description = req.body.description;
    const game = req.body.game;
    const maxPlayers = req.body.max_players;
	console.log(game, description, tournamentName)
	try {
		tournamentsManager.createTournament([0,tournamentName,description,game,maxPlayers, "1-1-1-1"], function(id){
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
			tournamentsManager.getAllTournaments(function(tournaments){
				const model = {title: "tournament"+tournament.id, tournament, tournaments}
				res.render("tournaments_tournament.hbs", model)
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
	//also get userID
	try{
		tournamentsManager.joinTournament(tournamentId, 0/*userID when accessable*/)
	}
	catch(error){
		const model = {error}
		res.render("error.hbs", model);
	}
})

router.post("/:id/leave", function(req,res){
    const tournamentId = req.params.id;
    try{
        tournamentsManager.leaveTournament(tournamentId, 0/*userID when accessable*/)
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


module.exports = router;