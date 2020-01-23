const dashboardManager = require("../../../bll/dashboard-manager")

exports.getDashboardContent = function(){
    try{
        const content = dashboardManager.getDashboardContent()
        const model = {dashboardItems: content}
        return model
    }
    catch(error){
        const model = {error: error}
        return model
    }
}