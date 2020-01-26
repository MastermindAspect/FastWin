const hubsManager = require("../../bll/hubsManager");
const tournamentsManager = require("../../bll/tournamentsManager")
exports.getDashboardContent = function(userId, callback){
    try{
        hubsManager.getAllHubsByUser(userId, function(hubs){
            tournamentsManager.getAllTournamentByUser(userId, function(tournaments){
                callback(hubs, tournaments)
            })
        })
    }
    catch(error){
        //handle error
    }
}