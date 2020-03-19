const express = require('express');
const usersManager = require('../../bll/usersManager')

module.exports = function ({ usersManager }) {

    const router = express.Router()

    router.get('/:userId', function (req, res) {
        const userId = req.params.userId;
        usersManager.getUserById(userId, function (user) {
            res.status(200).json({"message":"Successfully got user!", "success": "true", "user": user})
        })
    })

    router.post('/create', function (req, res) {
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        usersManager.createUser(username, email, password, password, function (errors, dbError) {
            if (errors || dbError) {
                res.status(400).json({"message": "Failed to create account!", "success": "false", "errors": {errors,dbError}})
            } else {
                res.status(201).json({"message": "Successfully created account!", "success": "true"})
            }
        })
    })

    return router

}
