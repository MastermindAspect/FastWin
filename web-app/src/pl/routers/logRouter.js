const express = require("express");

module.exports = function({ logManager }) {

    const router = express.Router()

    router.get('/', (req, res) => {
        console.log("Comes to router")
        const model = { title: "Login" }
        res.render("login", model);
    });

    router.post('/login', (req, res) => {
        const email = req.body.loginEmail
        const password = req.body.loginPassword
        logManager.loginUser(email, password, function (user, loginErrors) {
            if (loginErrors.length > 0) {
                const modal = {
                    loginEmail: email,
                    loginErrors
                }
                res.render("log", modal)
            } else {
                req.session.loggedIn = true
                req.session.userId = user.id
                res.redirect("/")
            }
        })

    })

    router.get('/logout', (req, res) => {
        if (req.session.loggedIn) {
            req.session.destroy()
            res.redirect('/')
        } else {
            redirect('/')
        }
    })


    return router

}