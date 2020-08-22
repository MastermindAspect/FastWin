bcrypt = require('bcrypt')

module.exports = function({usersRepository}) {
    return {
        getAllUsers: function(callback) {
            usersRepository.getAllUsers(function(users, error) {
                if (error) {
                    console.log(error)
                    callback(null, "Error getting users")
                } else {
                    callback(users, null)
                }
            })
        },
        
        getUserById: function(userId, callback) {
            usersRepository.getUserById(userId, function(user, error) {
                if (error) {
                    callback(user, "Error getting user")
                } else {
                    callback(user, null)
                }
            })
        },
        
        createUser: function (username, email, password, validationPassword, callback) {
            let errors = []
            usersRepository.getUserByEmail(email, function (user, err) {
                //handle error
                if (err) {
                    callback(errors, "Error getting user")
                } else {
                    if (user) {
                         errors.push("Email is already in use")
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
                        usersRepository.createUser(username, email, passHash, function (err) {
                            if(err) {
                                if(err == "Username is already in use") {
                                    errors.push(err)
                                    callback(errors, null)
                                } else {
                                    callback(null, err)
                                }
                            } else {
                                callback(null, null)
                            }
                        })
                    } else {
                        callback(errors, null)
                    }
                }
            })
                
        }
    }
}

