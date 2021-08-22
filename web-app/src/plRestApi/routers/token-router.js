const express = require("express");
const jwt = require("jsonwebtoken")
const REFRESH_TOKEN_SECRET="10dabb3cdadedcb7d1d92dc3847ebaffb3358d6c2d09a72a0eb829feb8d44cf45b73a161be774e04837d5e58d423b2d9fc84ff1069193a92e516752cceb68fe7"
const CLIENT_ID_SECRET ='6dc01ea4482429085eeaa0843970b9504f454b8682c5ecc6a1329736d70967cbc12dbf5e9615bfb6bb5bca6b0bc4519b4315ba2d7b0365b013435280bcd8cdef'

/*module.exports = function({logManager}){
    const router = express.Router()
    router.post("/", (req,res) => {
        const refreshToken = req.body.token;
        const grant_type = req.body.grant_type
        if (!res.finished) {
            if (grant_type != "refresh_token") {
                res.status(400).json({"message": "unsupported_grant_type", "success": "false"})
                return
            }
            if (refreshToken == null) return res.status(401).end()
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err,user) =>{
                if (err) return res.status(403).json({})
                const accessToken = logManager.generateAccessToken({userId: user.id})
                return res.status(201).json({"access_token": accessToken}).end()
            })
        }
    })

    router.get("/verify", (req,res) => {
        const token = req.body.token;
        const grant_type = req.body.grant_type
        if (!res.finished) {
            if (grant_type != "verify") {
                res.status(400).json({"message": "unsupported_grant_type", "success": "false"})
                return
            }
            if (token == null) return res.status(401).end()
            jwt.verify(token, CLIENT_ID_SECRET, (err,user) =>{
                console.log(err,user)
                if (err) return res.status(403).json({error:"unauth"})
                return res.status(200).json({"user_details": user}).end()
            })
        }
    })

    return router
}*/