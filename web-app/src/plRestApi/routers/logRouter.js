const express = require("express");
const jwt = require("jsonwebtoken")
const ACCESS_TOKEN_SECRET = "097f31a708f8d44663e87323176af5a5adbcff091522d7229e77f6dd3a0b5e73e662439b94f362427caee43651b1182c2019c1fb396b7650d80039a6049dc850"
module.exports = function({ logManager }) {
    const router = express.Router()
    router.post('/', (req, res) => {
        const email = decodeURI(req.body.username)
        const password = decodeURI(req.body.password)
        const grant_type = req.body.grant_type
        if (grant_type == "password"){
            logManager.loginUser(email, password, function (user, loginErrors, dbError) {

                if (dbError) res.status(404).json({"message": "Unable to login!", "success": "false", "errors": dbError})

                else if (loginErrors) {
                    res.status(404).json({"message": "Unable to login!", "success": "false", "errors": loginErrors})
                } else {
                    const userSign = {userId: user.id}
                    const accessToken = jwt.sign(userSign, ACCESS_TOKEN_SECRET, {expiresIn: "1h"})
                    const idToken = jwt.sign({sub: user.id, email: user.email, nickname: user.username}, ACCESS_TOKEN_SECRET)
                    //const refreshToken = jwt.sign(userSign, REFRESH_TOKEN_SECRET)
                    res.status(200).json({"access_token": accessToken,"id_token": idToken})
                }
            })
        } else {
            res.status(400).json({"message": "unsupported_grant_type", "success": "false"})
            return
        }
    })

    return router

}