
module.exports = function({hubsManager, tournamentsManager}){
    return {
        getDashboardContent: function(userId,loggedin,callback){
            if (userId && loggedin){
                hubsManager.getAllHubsByUser(userId, loggedin,function(hubs, error, dbError1){
                    tournamentsManager.getAllTournamentByUser(userId, loggedin,function(tournaments, error, dbError2){
                        if (dbError1 || dbError2) {
                            const hubsError = {
                                hubName: "Error getting hubs"
                            }
                            const tournamentsError = {
                                tournamentName: "Error getting tournaments"
                            }
                            if (dbError2 && dbError2) {
                                callback(hubsError, tournamentsError)
                            } else if (dbError1) {
                                callback(hubsError, tournaments)
                            } else if (dbError2) {
                                callback(hubs, tournamentsError)
                            }
                        } else {
                            callback(hubs, tournaments)
                        }
                    })
                })
            }else {
                callback([], [])
            }
        }
    }
}
