const express = require("express");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const redis = require("redis");
const redisClient = redis.createClient({host: 'redis', port: 6379});
dotenv.config()

const REFRESH_TOKEN_SECRET="10dabb3cdadedcb7d1d92dc3847ebaffb3358d6c2d09a72a0eb829feb8d44cf45b73a161be774e04837d5e58d423b2d9fc84ff1069193a92e516752cceb68fe7"
const CLIENT_ID_SECRET ='6dc01ea4482429085eeaa0843970b9504f454b8682c5ecc6a1329736d70967cbc12dbf5e9615bfb6bb5bca6b0bc4519b4315ba2d7b0365b013435280bcd8cdef'
module.exports = function({ logManager }) {
    const router = express.Router()
    router.post('/login', (req, res) => {
        const email = req.body.username
        const password = req.body.password
        const grant_type = req.body.grant_type
        if (!email || !password || !grant_type){
            res.status(400).json({"message": "invalid_request", "success": "false"})
            return
        }
        if (grant_type == "password"){
            logManager.loginUser(email, password, function (user, loginErrors, dbError) {

                if (dbError) res.status(404).json({"message": "Unable to login!", "success": "false", "errors": dbError})

                else if (loginErrors) {
                    res.status(404).json({"message": "Unable to login!", "success": "false", "errors": loginErrors})
                } else {
                    const userSign = {userId: user.id}
                    const idToken = jwt.sign({sub: user.id, email: user.email, nickname: user.username}, CLIENT_ID_SECRET)
                    const accessToken = logManager.generateAccessToken(userSign)
                    const refreshToken = jwt.sign(userSign, REFRESH_TOKEN_SECRET)
                    redisClient.set("idToken", idToken, redis.print)
                    redisClient.set("userId", user.id, redis.print)
                    redisClient.rpush(["refreshTokens", refreshToken], redis.print)
                    res.status(200).json({"access_token": accessToken, "refresh_token": refreshToken, "id_token": idToken})
                }
            })
        } else {
            res.status(400).json({"message": "unsupported_grant_type", "success": "false"})
            return
        }
    })

    router.delete('/logout', (req, res) => {
        const token = req.body.token
        if (token){
            redisClient.lrem("refreshTokens", 0,req.body.token,redis.print)
            redisClient.del("userId",redis.print)
            res.status(204).json({"message": "Successfully logged out and deleted refresh token!", "success": "true"})
        }else {
            res.status(404).json({"message": "Please specify a token to logout", "success": "false"})
        }
    })


    return router

}