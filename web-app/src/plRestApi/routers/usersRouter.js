const express = require('express');
const usersManager = require('../../bll/usersManager')
const ACCESS_TOKEN_SECRET = "097f31a708f8d44663e87323176af5a5adbcff091522d7229e77f6dd3a0b5e73e662439b94f362427caee43651b1182c2019c1fb396b7650d80039a6049dc850"
const jwt = require("jsonwebtoken")
module.exports = function ({ usersManager }) {

    const router = express.Router()

    router.get('/id:userId', function (req, res) {
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
    router.get("/userInfo",function(req,res){
        let authHeader = req.headers['authorization']
        let token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.status(401).json({"message": "No token", "success": "false"})
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err,user) => {
            if (err) return res.status(403).json({"message": "Not authorized", "success": "false"})
            else return res.status(200).json({user, message:"Successfully gathered user info!", " success": "true"})
        })
    })

    return router

}
