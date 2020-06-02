const express = require('express');

module.exports = function ({ usersManager, hubsManager, tournamentsManager }) {

    const router = express.Router()

    router.get('/', function(req, res) {
        usersManager.getAllUsers(function(users, dbError) {
            if (dbError) {
                const modal = { 
                    error: [dbError]
                }
                res.render("error.hbs", modal)
            } else {
                const modal = {
                    allUsers: users
                }
                res.render("usersAll.hbs", modal)
            }
        })
    })

    router.get('/:userId', function(req, res) {
        const userId = req.params.userId;

        usersManager.getUserById(userId, function (user, dbError1) {
            hubsManager.getAllHubsByUser(userId, true, function (hubs, dbError2) {
                tournamentsManager.getAllTournamentByUser(userId, true, function(tournaments, dbError3) {
                    if (dbError1 || dbError2) {
                        const modal = { 
                            error: [dbError1, dbError2, dbError3]
                        }
                        res.render("error.hbs", modal)
                    } else {
                        const randomHubs = []
                        if (hubs) {
                            if (hubs.length > 3) {
                                let randomHub = Math.floor(Math.random() * hubs.length)
                                for (let i = 0; i < 3; i++){
                                    randomHubs.push(hubs[randomHub])
                                    randomHub++
                                    if (randomHub == hubs.length) {
                                        randomHub = 0
                                    }
                                }
                            } else {
                                for (hub in hubs) {
                                    randomHubs.push(hubs[hub])
                                }
                            }
                        }
                        
                        const randomTournaments = []
                        if (tournaments) {
                            if (tournaments.length > 3) {
                                let randomTournament = Math.floor(Math.random() * tournaments.length)
                                for (let i = 0; i < 3; i++){
                                    randomTournaments.push(tournaments[randomTournament])
                                    randomTournament++
                                    if (randomTournament == tournaments.length) {
                                        randomTounament = 0
                                    }
                                }
                            } else {
                                for (tournament in tournaments) {
                                    randomTournaments.push(tournaments[tournament])
                                }
                            }
                        }

                        user.createdAt = String(user.createdAt).slice(0, 16)
                        const modal = {
                            user,
                            threeHubs: randomHubs,
                            allHubs: hubs,
                            threeTournaments: randomTournaments
                        }
                        res.render("user", modal)
                    }
                })
            })
        })
    })

    router.post('/create', function (req, res) {
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password1
        const validationPassword = req.body.password2
        
        usersManager.createUser(username, email, password, validationPassword, function (errors, dbError) {
            if (dbError) {
                const model = {
                    error: [dbError]
                }
                res.render("error.hbs", model)
            } else if (errors) {
                const modal = {
                    username,
                    createAccountEmail: email,
                    password,
                    validationPassword,
                    createAccountErrors: errors,
                    errorType: "createError"
                }
                res.render("login", modal)
            } else {
                res.render("login")
            }
        })   
    })

    return router

}
