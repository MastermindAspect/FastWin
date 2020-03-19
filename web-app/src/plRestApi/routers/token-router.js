const express = require("express");
const jwt = require("jsonwebtoken")
const redis = require("redis");
const redisClient = redis.createClient({host: 'redis', port: 6379});
const REFRESH_TOKEN_SECRET="10dabb3cdadedcb7d1d92dc3847ebaffb3358d6c2d09a72a0eb829feb8d44cf45b73a161be774e04837d5e58d423b2d9fc84ff1069193a92e516752cceb68fe7"

module.exports = function({logManager}){
    const router = express.Router()
    router.post("/", (req,res) => {
        const refreshToken = req.body.token;
        const grant_type = req.body.grant_type

        if (grant_type != "refresh_token") {
            res.status(400).json({"message": "unsupported_grant_type", "success": "false"})
            return
        }
        if (refreshToken == null) return res.status(401).json({})
        redisClient.lrange("refreshTokens", 0,-1, (err,data) => {
            let isMatch = false
            data.forEach(token =>{
                if (refreshToken == token) isMatch = true
            })
            if (isMatch == true) return res.status(401).json({})
        })
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err,user) =>{
            if (err) return res.status(403).json({})
            const accessToken = logManager.generateAccessToken({userId: user.id})
            res.json({"access_token": accessToken}).end()
        })
    })

    return router
}