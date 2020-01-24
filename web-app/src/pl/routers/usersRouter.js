const express = require('express');
const usersManager = require('../../bll/usersManager')

const router = express.Router()


router.get('/:userId', function(req, res) {
    const userId = req.params.userId;
    usersManager.getUserById(userId, function(user) {
        usersManager.getMostUsedHubs(userId, function(hubs) {
            const modal = {
                user,
                hubs
            }
            res.render("user", modal)
        })
    })
})


module.exports = router