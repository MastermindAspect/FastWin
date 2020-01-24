const usersRepository = require('../dal/usersRepository')

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
