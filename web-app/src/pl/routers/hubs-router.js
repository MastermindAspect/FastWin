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
	const model = {title: "Create"}
	res.render("hubs_create", model);
})

router.post("/create", function(req,res){

})	


module.exports = router;