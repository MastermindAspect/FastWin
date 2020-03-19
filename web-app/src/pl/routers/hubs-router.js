const express = require("express");

module.exports = function({hubsManager, postsManager}){
	const router = express.Router()
	router.get("/all", function(req,res){
		hubsManager.getAllHubs(function (allHubs, dbError) {
			if (dbError) {
				const model = {
					error: [dbError]
				}
				res.render("error.hbs", model);
			} else {
				const model = {
					title: "All hubs",
					allHubs
				}
				res.render("hubs_all.hbs", model);
			}
		})
	})

	router.get("/create", function(req,res){
		const model = {title: "Create"}
		res.render("hubs_create", model);
	})

	router.post("/create", function(req,res){
		const hubName = req.body.hub_name;
		const description = req.body.description;
		const game = req.body.game;
		hubsManager.createHub(req.session.userId, hubName, description, game, req.session.loggedIn, function (id, errors, dbError) {
			if (dbError) {
				const model = {
					 error: [dbError]
				}
				res.render("error.hbs", model)
			} else if (errors) {
				const model = {
					hubName,
					description,
					errors
				}
				res.render("hubs_create", model);   //Displaya errors i hubs_create
			} else {
				res.redirect("/hubs/" + id);
			}
		})
	})	

	router.get("/:id", function(req,res){
		const id = req.params.id;
		const userId = req.session.userId;
		hubsManager.getHub(id, function (hub, dbError1) {
			hubsManager.isSubscribed(id, userId, function (subscribed, dbError2) {
				postsManager.getHubPosts(id, function (posts, dbError3) {
					if (dbError1 || dbError2 || dbError3) {
						const model = {
							error: [dbError1, dbError2, dbError3]
						}
						res.render("error.hbs", model)
					} else {
						const model = {
							title: "hub" + hub.id,
							hub, subscribed, 
							posts 
						}
						res.render("hubs_hub.hbs", model);
					}
				})
			})
		})
	})

	router.post("/:id/subscribe", function(req,res){
		const hubId = req.params.id;
		hubsManager.subscribeTo(hubId, req.session.loggedIn, req.session.userId, function(error, dbError) {
			if (dbError) {
				const model = {
					error: [dbError]
				}
				res.render("error.hbs", model);
			} else if (error) {
				hubsManager.getHub(hubId, function (hub, dbError1) {
					hubsManager.isSubscribed(hubId, req.session.userId, function (subscribed, dbError2) {
						postsManager.getHubPosts(hubId, function (posts, dbError3) {
							if (dbError1 || dbError2 || dbError3) {
								const model = {
									error: [dbError1, dbError2, dbError3]
								}
								res.render("error.hbs", model)
							} else {
								console.log(error)
								const model = {
									title: "hub" + hub.id,
									hub, 
									subscribed, 
									posts,
									subscribeError: error
								}
								res.render("hubs_hub.hbs", model);
							}
						})
					})
				})
			} else {
				res.redirect("/hubs/" + hubId)
			}
		})

	})

	router.post("/:id/unsubscribe", function(req,res){
		const hubId = req.params.id;
		hubsManager.unSubscribeTo(hubId, req.session.loggedIn, req.session.userId, function(error, dbError) {
			if (dbError) {
				const model = {
					error: [dbError]
				}
				res.render("error.hbs", model);
			} else if (error) {
				const model = {
					subscribeError: error
				}
				res.render("error.hbs", model);
			} else {
				res.redirect("/hubs/" + hubId)
			}
		})
	})

	router.get("/:id/members", function(req,res){
		const hubId = req.params.id;
		hubsManager.getMembers(hubId, function (users, dbError) {
			if (dbError) {
				const model = { 
					error: [dbError]
				}
				res.render("error.hbs", model)
			} else {
				const model = {
					title: "Members",
					users 
				}
				res.render("hubs_members.hbs", model);
			}
		})
	})

	return router
}