const hubsManager = require("../../bll/hubsManager");
const tournamentsManager = require("../../bll/tournamentsManager")
exports.getDashboardContent = function(userId,loggedin, callback){
    try{
        hubsManager.getAllHubsByUser(userId, loggedin,function(hubs){
            tournamentsManager.getAllTournamentByUser(userId, loggedin,function(tournaments){
                callback(hubs, tournaments)
            })
        })
    }
    catch(error){
        //handle error
    }
}