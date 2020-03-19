bcrypt = require('bcrypt')

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
        }
    }
}
