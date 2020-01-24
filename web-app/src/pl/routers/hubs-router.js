const express = require("express");
const router = express.Router();
const hubsManager = require('../../bll/hubsManager')

router.get("/", function(req,res){
	//hubs initial page
	try {
		hubsManager.getAllHubs(function(hubs){
			const model = {
				hubs
			}
			res.render("hubs.hbs", model);
		})
	} catch (error){
		const model = {
			error
		}
		res.render("error.hba", model);
	}
})

router.get("/all", function(req,res){
	hubsManager.getAllHubs(function(hubs){
		const model = {
			title: "All Hubs",
			hubs
		}
		res.render("hubs_all.hbs", model);
	})
})

router.get("/create", function(req,res){
	hubsManager.getAllHubs(function(hubs){
		const model = {title: "Create", hubs}
		res.render("hubs_create", model);
	})
})

router.post("/create", function(req,res){
	const hubName = req.body.hub_name;
	const description = req.body.description;
	const game = req.body.game;
	console.log(game, description, hubName)
	try {
		hubsManager.createHub([hubName,description,game, "1-1-1-1"], function(id){
			res.redirect("/hubs/"+id);
		})
	} catch(error){
		const model = {error}
		res.render("error.hbs", model)
	}
})	

router.get("/:id", function(req,res){
	const id = req.params.id;
	try{
		hubsManager.getHub(id,function(hub){
			hubsManager.getAllHubs(function(hubs){
				const model = {title: "hub"+hub.id, hub, hubs}
				res.render("hubs_hub.hbs", model)
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
	//also get userID
	try{
		hubsManager.subscribeTo(hubId, 0)
	}
	catch(error){
		console.log(error)
		const model = {error}
		res.render("error.hbs", model);
	}
})


module.exports = router;