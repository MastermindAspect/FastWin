const express = require('express');

const router = express.Router()

router.get('/', (req, res) => {
    //get user by id
    res.render("user", {title: "User"});
})

module.exports = router