const dashboardRepository = require("../dal/dashboardRepository");

exports.getDashboardContent = function(userId, callback){
    try {
        dashboardRepository.getDashboardContent(userId, function(hubs){
            callback(hubs);
        })
    }
    catch(error){
        throw "Error getting dashboardContent";
    }

}