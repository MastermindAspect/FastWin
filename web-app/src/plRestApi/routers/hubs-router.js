const express = require("express");
const authenticate = require("../authenticate/authentication")

module.exports = function({hubsManager, postsManager, authentication}){
	const router = express.Router()
	router.get("/all", authentication.authenticateToken,function(req,res){
		try {
			hubsManager.getAllHubs(function(allHubs){
				res.status(200).json({"message": "Successfully got all hubs!", "success": "true","allHubs": allHubs});
			})
		} catch (error){
			res.status(404).json({"message": error, "success": "false"})
		}
	})

	router.post("/create", function(req,res){
		const hubName = req.body.hub_name;
		const description = req.body.description;
		const game = req.body.game;
		try {
			hubsManager.createHub([req.userId,hubName,description,game, "1-1-1-1"],true, function(id){
				if (!res.finished){
					res.writeHead(201, {'Location': "hubs/"+id})
					res.end()
				}
			})
		} catch(error){
			res.status(404).json({"message": error, "success": "false"}).end()
		}
	})	

	router.get("/:id", authentication.authenticateToken,function(req,res){
		const id = req.params.id;
		try{
			hubsManager.getHub(id,function(hub){
				res.status(200).json({"message": "Successfully got hub", "success": "true", hub})
			})
		}
		catch(error){
			res.status(404).json({"message": error, "success": "false"})
		}
	})

	router.post("/:id/subscribe",authentication.authenticateToken, function(req,res){
		const hubId = req.params.id;
		try{
			hubsManager.subscribeTo(hubId,req.session.loggedIn, req.session.userId)
			res.status(200).json({"message": "Successfully subscribed to hub!", "success": "true"})
		}
		catch(error){
			res.status(404).json({"message": error, "success": "false"})
		}
	})

	router.post("/:id/unsubscribe",authentication.authenticateToken, function(req,res){
		const hubId = req.params.id;
		try{
			hubsManager.unSubscribeTo(hubId,req.session.loggedIn,req.session.userId)
			res.status(200).json({"message": "Successfully unsubscribed to hub!", "success": "true"})
		}
		catch(error){
			res.status(404).json({"message": error, "success": "false"})

		}
	})

	router.get("/:id/members", function(req,res){
		const hubId = req.params.id;
		try {
			hubsManager.getMembers(hubId, function(users){
				res.status(200).json({"message": "Successfully got all members!", "success": "true", "members": users})
			})
		}
		catch(error){
			res.status(404).json({"message": error, "success": "false"})

		}
	})

	return router
}