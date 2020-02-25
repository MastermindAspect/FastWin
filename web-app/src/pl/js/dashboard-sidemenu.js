
module.exports = function({hubsManager, tournamentsManager}){
    return {
        getDashboardContent: function(userId,loggedin,callback){
            try{
                if (userId && loggedin){
                    hubsManager.getAllHubsByUser(userId, loggedin,function(hubs){
                        tournamentsManager.getAllTournamentByUser(userId, loggedin,function(tournaments){
                            console.log(tournaments)
                            callback(hubs, tournaments)
                        })
                    })
                }
                else {
                    callback([], [])
                }
            }
            catch(error){
                //handle error
            }
        }
    }
}
