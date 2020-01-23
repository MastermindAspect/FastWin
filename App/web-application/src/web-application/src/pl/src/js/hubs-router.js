const express = require("express");
const router = express.Router();

router.get("/", function(req,res){
    //hubs initial page
    res.render("hubs", {title: "Hubs"})
})


module.exports = router;