bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const ACCESS_TOKEN_SECRET = "097f31a708f8d44663e87323176af5a5adbcff091522d7229e77f6dd3a0b5e73e662439b94f362427caee43651b1182c2019c1fb396b7650d80039a6049dc850"


module.exports = function({usersRepository}) {
    return {
        loginUser: function(email, password, callback) {
            let errors = []
            usersRepository.getUserByEmail(email, function (user, err) {
                if (err) {
                    console.log(err)
                    callback(null, null, "Error getting user")
                } else {
                    if (user) {
                        if (!bcrypt.compareSync(password, user.passHash)) {
                            errors.push("Wrong password")
                        }
                    } else {
                        errors.push("There is no user with this email")
                    }
                    if (errors.length == 0) {
                        callback(user, null, null)
                    } else {
                        callback(user, errors, null)
                    }
                }
            })
        },
        generateAccessToken: function(user){
			return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: "10m"})
		}
    }
}
