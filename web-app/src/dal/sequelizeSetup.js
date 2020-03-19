const Sequelize = require('sequelize')
const pg = require('pg')
const db = new Sequelize('postgresql://abc321:myPostgresDB@postgreDB:5432/db')

db.authenticate()
    .then(function() {console.log('Connected to database')})
    .catch(function(err) {console.log('Error: ' + err)})
//==Models===============================================

const User = db.define('user', {
    username: Sequelize.TEXT,
    passHash: Sequelize.TEXT,
    email: Sequelize.TEXT
})

const Hub = db.define('hub', {
    hubName: Sequelize.TEXT,
    description: Sequelize.TEXT,
    game: Sequelize.TEXT
})

const Tournament = db.define('tournament', {
    tournamentName: Sequelize.TEXT,
    description: Sequelize.TEXT,
    game: Sequelize.TEXT,
    maxPlayers: Sequelize.TEXT
})

const Post = db.define('post', {
    author: Sequelize.TEXT,
    title: Sequelize.TEXT,
    content: Sequelize.TEXT
})
//==Relations============================================
User.hasMany(Hub)
User.hasMany(Tournament)
User.hasMany(Post)

User.belongsToMany(Tournament, {as: "Participation", through: "tournamentUser"})
Tournament.belongsToMany(User, {as: "Players", through: "tournamentUser"})

User.belongsToMany(Hub, {as: "Subscriptions", through: 'hubSubscriptions', foreignKey: 'userId'})
Hub.belongsToMany(User, {as: "Subscribers", through: 'hubSubscriptions', foreignKey: 'hubId'})

Hub.hasMany(Post, {as: "hubid"})

db.sync()

module.exports = {
    User: User,
    Hub: Hub,
    Tournament: Tournament,
    Post: Post,
    Sequelize: db
}