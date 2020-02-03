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

router.post('/create', function(req, res) {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password1
    const validationPassword = req.body.password2
    usersManager.createUser(username, email, password, validationPassword, function(createAccountErrors) {
        if (createAccountErrors.length > 0) {
            const modal = {
                username,
                createAccountEmail: email,
                password,
                validationPassword,
                createAccountErrors
            }
            res.render("login", modal)
        } else {
            res.render("login")
        }
    })
})



module.exports = router