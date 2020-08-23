const ACCESS_TOKEN_SECRET = "097f31a708f8d44663e87323176af5a5adbcff091522d7229e77f6dd3a0b5e73e662439b94f362427caee43651b1182c2019c1fb396b7650d80039a6049dc850"
const jwt = require("jsonwebtoken")
const CLIENT_ID_SECRET ='6dc01ea4482429085eeaa0843970b9504f454b8682c5ecc6a1329736d70967cbc12dbf5e9615bfb6bb5bca6b0bc4519b4315ba2d7b0365b013435280bcd8cdef'

module.exports = function(){
	return {
        authenticateToken: function(req,res,next){
            let authHeader = req.headers['authorization']
            let token = authHeader && authHeader.split(' ')[1]
            if (token == null) return res.status(401).json({"message": "No token", "success": "false"})
            jwt.verify(token, ACCESS_TOKEN_SECRET, (err,access) => {
                if (err) return res.status(403).json({"message": "Not authorized", "success": "false"})
                else next();
            })
        },
        getUserIdFromIdToken: function(res,req,callback){
            let authHeader = req.headers['authorization']
            let token = authHeader && authHeader.split(' ')[1]
            if (token == null) return res.status(401).json({"message": "No token", "success": "false"})
            jwt.verify(token, ACCESS_TOKEN_SECRET, (err,access) => {
                if (err) return res.status(403).json({"message": "Not authorized", "success": "false"})
                else callback(access.userId);
            })
        }      
    }
}