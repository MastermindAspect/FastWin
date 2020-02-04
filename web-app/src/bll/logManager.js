const usersRepository = require('../dal/usersRepository')

bcrypt = require('bcrypt')

exports.loginUser = function(email, password, callback) {
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

            if (errors.length == 0) {
                //CREATE SESSION FOR LOOGED IN USER
            }

            callback(errors)
        }
    })
}