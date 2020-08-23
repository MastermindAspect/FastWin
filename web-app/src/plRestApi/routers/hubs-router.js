const express = require("express");
const redis = require("redis");
const redisClient = redis.createClient({host: 'redis', port: 6379});

module.exports = function({hubsManager, postsManager, authentication}){
	const router = express.Router()
	router.get("/all", authentication.authenticateToken,function(req,res){
		hubsManager.getAllHubs(function(allHubs,dbError){
			if (dbError) res.status(404).json({"message": dbError, "success": "false"})
			else res.status(200).json({"message": "Successfully got all hubs!", "success": "true","allHubs": allHubs});
		})
	})

	router.post("/create",authentication.authenticateToken, function(req,res){
		const hubName = req.body.hub_name;
		const description = req.body.description;
		const game = req.body.game;
		authentication.getUserIdFromIdToken(res,req, function(userId) {
			hubsManager.createHub(userId,hubName,description,game,true, function(id, errors, dbError){
				if (dbError || errors) res.status(404).json({"message": "Error creating hub", "success": "false", "errors": {dbError,errors}}).end()
				else{
					if (!res.finished){
						res.writeHead(201, {'Location': "hubs/"+id})
						res.end()
					}
				}
			})
		});
	})	

	router.put("/edit",authentication.authenticateToken,function(req,res){
		const hubId = req.body.hubId;
		const hubName = req.body.hub_name;
		const description = req.body.description;
		const game = req.body.game;
		authentication.getUserIdFromIdToken(res,req, function(userId) {
			hubsManager.updateHub(hubId,userId,hubName,description,game,true, function(errors,dbError){
				if (dbError || errors) {
					res.status(404).json({"message": "Error updating hub", "success": "false", "errors": {dbError,errors}}).end()
				}
				else {
					res.writeHead(200, {'Location': "hubs/"+hubId})
					res.end()
				}
			})
		})
	})

	router.delete("/",authentication.authenticateToken,function(req,res){
		const hubId = req.body.hubId;
		authentication.getUserIdFromIdToken(res,req, function(userId) {
			hubsManager.deleteHub(hubId,userId, true, function(errors,dbError){
				if (dbError) {
					res.status(404).json({"message": "Error deleting hub", "success": "false", "errors": {dbError,errors}}).end()
				}
				else {
					res.status(202).json({"message": "Successfully deleted hub", "success": "true"}).end()
				}
			})
		})
	})

	router.get("/:id", authentication.authenticateToken,function(req,res){
		const id = req.params.id;
		hubsManager.getHub(id,function(hub, dbError){
			if (dbError) res.status(404).json({"message": dbError, "success": "false"})
			else res.status(200).json({"message": "Successfully got hub", "success": "true", hub})
		})
	})

	router.post("/:id/subscribe",authentication.authenticateToken, function(req,res){
		const hubId = req.params.id;
		authentication.getUserIdFromIdToken(res,req, function(userId) {
			hubsManager.subscribeTo(hubId,true, userId, function(error,dbError){
				if (dbError) res.status(404).json({"message": error, "success": "false"})
				else res.status(200).json({"message": "Successfully subscribed to hub!", "success": "true"})
			})
		})
	})

	router.post("/:id/unsubscribe",authentication.authenticateToken, function(req,res){
		const hubId = req.params.id;
		authentication.getUserIdFromIdToken(res,req, function(userId) {
			hubsManager.unSubscribeTo(hubId,true,userId,hubName,description,game,true ,function(error, dbError) {
				if (dbError) res.status(404).json({"message": error, "success": "false"})
				else res.status(200).json({"message": "Successfully unsubscribed to hub!", "success": "true"})
			})
		})
	})

	router.get("/:id/members", function(req,res){
		const hubId = req.params.id;
		hubsManager.getMembers(hubId, function(users, dbError){
			if (dbError) res.status(404).json({"message": error, "success": "false"})
			else res.status(200).json({"message": "Successfully got all members!", "success": "true", "members": users})
		})
	})

	return router
}