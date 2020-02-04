const usersRepository = require('../dal/usersRepository')

bcrypt = require('bcrypt')

exports.getAllUsers = function(callback) {
    usersRepository.getAllUsers(function(users) {
        callback(users)
    })
}

exports.getUserById = function(userId, callback) {
    usersRepository.getUserById(userId, function(user) {
        callback(user)
    })
}

exports.getMostUsedHubs = function(userId, callback) {
    usersRepository.getMostUsedHubs(userId, function(hubs) {
        callback(hubs)
    })
}

exports.createUser = function(username, email, password, validationPassword, callback) {
    let errors = []

    usersRepository.getUserByUsername(username, function(err, user) {
        //handle error
        if (err) {
            console.log(err)
        } else {
            if (user) {
                errors.push("Username is already in use")
            }
            if (username == "") {
                errors.push("You need to have a username")
            }
    
            if (email == "") {
                errors.push("You need to type a email")
            } else if (!email.includes('@')) {
                errors.push("This is not a valid email")
            }
            if (password == "" || password.length < 5) {
                errors.push("The password needs to contain 5 characters")
            }
            if (password != validationPassword) {
                errors.push("The passwords does not match")
            }
    
            if (errors.length == 0) {
                const saltRounds = 10
                const passHash = bcrypt.hashSync(password, saltRounds)
                usersRepository.createUser(username, email, passHash, function(err) {
                    if (err) {
                        console.log(err)
                    }
                })
            }

            callback(errors)
        }
        
    })
}


