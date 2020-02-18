const express = require("express");

module.exports = function({hubsManager}){
	const router = express.Router()
	router.get("/all", function(req,res){
		try {
			hubsManager.getAllHubs(function(hubs){
				const model = {
					title: "All hubs",
					hubs
				}
				res.render("hubs_all.hbs", model);
			})
		} catch (error){
			const model = {
				error
			}
			res.render("error.hba", model);
		}
	})

	router.get("/create", function(req,res){
		try{
			const model = {title: "Create"}
			res.render("hubs_create", model);
		}
		catch(error){
			const model = {title: "Error", error}
			res.render("error.hbs", model);
		}
	})

	router.post("/create", function(req,res){
		const hubName = req.body.hub_name;
		const description = req.body.description;
		const game = req.body.game;
		try {
			hubsManager.createHub([req.session.userId,hubName,description,game, "1-1-1-1"],req.session.loggedIn, function(id){
				res.redirect("/hubs/"+id);
			})
		} catch(error){
			const model = {error}
			res.render("error.hbs", model)
		}
	})	

	router.get("/:id", function(req,res){
		const id = req.params.id;
		const userId = req.session.userId;
		try{
			hubsManager.getHub(id,function(hub){
				hubsManager.isSubscribed(id,userId,function(isSubbed){
					const model = {title: "hub"+hub.id, hub,isSubbed}
					console.log(model)
					res.render("hubs_hub.hbs", model);
				})
			})
		}
		catch(error){
			const model = {error}
			res.render("error.hbs", model)
		}
	})

	router.post("/:id/subscribe", function(req,res){
		const hubId = req.params.id;
		try{
			hubsManager.subscribeTo(hubId,req.session.loggedIn, req.session.userId)
			res.redirect("/hubs/"+hubId)
		}
		catch(error){
			const model = {error}
			res.render("error.hbs", model);
		}
	})

	router.post("/:id/unsubscribe", function(req,res){
		const hubId = req.params.id;
		try{
			hubsManager.unSubscribeTo(hubId,req.session.loggedIn,req.session.userId)
			res.redirect("/hubs/"+hubId)
		}
		catch(error){
			const model = {error}
			res.render("error.hbs", model);
		}
	})

	router.get("/:id/members", function(req,res){
		const hubId = req.params.id;
		try {
			hubsManager.getMembers(hubId, function(users){
				const model = {title: "Members", users}
				res.render("hubs_members.hbs", model);
			})
		}
		catch(error){
			const model = {error}
			res.render("error.hbs", model)
		}
	})

	return router
}