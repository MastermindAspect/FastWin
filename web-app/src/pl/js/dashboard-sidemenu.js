const dashboardManager = require("../../../bll/dashboard-manager")

exports.getDashboardContent = function(userId, callback){
    try{
        dashboardManager.getDashboardContent(userId,function(hubs){
            callback(hubs)
        })
    }
    catch(error){
        //handle error
    }
}