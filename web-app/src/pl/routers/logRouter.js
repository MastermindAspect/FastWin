const express = require("express");

module.exports = function({ logManager }) {

    const router = express.Router()

    router.get('/', (req, res) => {
        const model = { title: "Login" }
        res.render("login", model);
    });

    router.post('/login', (req, res) => {
        const email = req.body.loginEmail
        const password = req.body.loginPassword
        logManager.loginUser(email, password, function (user, loginErrors, dbError) {
            if (dbError) {
                const model = {
                    error: [dbError]
                }
                res.render("error.hbs", model)
            } else if (loginErrors) {
                const modal = {
                    loginEmail: email,
                    loginErrors
                }
                res.render("login", modal)
            } else {
                req.session.loggedIn = true
                req.session.userId = user.id
                req.session.username = user.username;
                res.redirect('/')
            }
        }) 
    })

    router.post('/logout', (req, res) => {
        if (req.session.loggedIn) {
            req.session.destroy()
            res.redirect('/')
        } else {
            res.redirect('/')
        }
    })


    return router

}