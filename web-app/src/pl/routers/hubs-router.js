const express = require("express");
const router = express.Router();
const hubsManager = require('../../bll/hubsManager')
const dashboardContent = require("../js/dashboard-sidemenu")

router.get("/all", function(req,res){
	router.get("/", function(req,res){
		//hubs initial page
		/*try{
        dashboardContent.getDashboardContent(userId, function(hubs, tournaments){
            const model = {title: "Home", hubs, tournaments}
            console.log(model);
            res.render("tournaments_create", model);
        })
		}
		catch(error){
			const model = {title: "Error", error}
			res.render("error.hbs", model);
		}
		*/
		try {
			hubsManager.getAllHubs(function(hubs){
				const model = {
					title: "All hubs",
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
})

router.get("/create", function(req,res){
	/*try{
        dashboardContent.getDashboardContent(userId, function(hubs, tournaments){
            const model = {title: "Home", hubs, tournaments}
            console.log(model);
            res.render("tournaments_create", model);
        })
    }
    catch(error){
        const model = {title: "Error", error}
        res.render("error.hbs", model);
    }
    */
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
			/*
			dashboardContent.getDashboardContent(userId, function(hubs, tournaments){
				const model = {title: "hub"+hub.id, hub, hubs, tournaments}
				console.log(model);
				res.render("hubs_hubs.hbs", model);
			})
			*/
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

router.post("/:id/unsubscribe", function(req,res){
	const hubId = req.params.id;
	//also get userID
	try{
		hubsManager.subscribeTo(hubId, 0/*USER ID */)
	}
	catch(error){
		console.log(error)
		const model = {error}
		res.render("error.hbs", model);
	}
})

router.get("/:id/members", function(req,res){
	const hubId = req.params.id;
	try {
		hubsManager.getMembers(hubId, function(users){
			/*
			dashboardContent.getDashboardContent(userId, function(hubs, tournaments){
				const model = {title: "Members", users, hubs, tournaments}
				console.log(model);
				res.render("hubs_members.hbs", model);
			})
			*/
			const model = {title: "Members", users}
			res.render("hubs_members.hbs", model)
		})
	}
	catch(error){
		const model = {error}
		res.render("error.hbs", model)
	}
})

module.exports = router;