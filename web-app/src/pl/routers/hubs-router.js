const express = require("express");
const router = express.Router();
const hubsManager = require('../../bll/hubsManager')

router.get("/", function(req,res){
    //hubs initial page
    hubsManager.getAllHubs(function(hubs){
		// TODO: Also handle errors.
		const model = {
			hubs
		}
		res.render("hubs.hbs", model)
	})
})


module.exports = router;