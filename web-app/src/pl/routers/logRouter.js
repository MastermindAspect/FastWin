const express = require("express");
const router = express.Router();
const logManager = require('../../bll/logManager')

router.get('/', (req, res) => {
    const model = {title: "Login"}
    res.render("login", model);
});

router.post('/login', (req, res) => {
    const email = req.body.loginEmail
    const password = req.body.loginPassword
    logManager.loginUser(email, password, req.session, function(loginErrors) {
        if (loginErrors.length > 0) {
            const modal = {
                loginEmail: email,
                loginErrors
            }
            res.render("login", modal)
        } else {
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

module.exports = router