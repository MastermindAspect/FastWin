bcrypt = require('bcrypt')

module.exports = function({usersRepository}) {
    return {
        loginUser: function(email, password, callback) {
            let errors = []
            usersRepository.getUserByEmail(email, function(err, user) {
                if (err) {
                    console.log(err)
                } else {
                    if (user) {
                        console.log(user.passHash)
                        console.log(password)
                        if (!bcrypt.compareSync(password, user.passHash)) {
                            errors.push("Wrong password")
                        }
                    } else {
                        errors.push("There is no user with this email")
                    }
        
                    callback(user, errors)
                }
            })
        }
    }
}
