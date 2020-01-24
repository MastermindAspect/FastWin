const hubsRepository = require('../dal/hubsRepository')

exports.getAllHubs = function(callback){
	try {
		hubsRepository.getAllHubs(function(hubs){
			// TODO: Also handle errors.
			callback(hubs)
		})
	}
	catch(error){
		throw error
	}
}

exports.createHub = function(values, callback){
	//check if user is logged in
	//eles throw exception
	try{
		hubsRepository.createHub(values, function(id){
			callback(id)
		})
	} catch(error){
		throw "could not get hub"
	}
}

exports.getHub = function(id, callback){
	//check if user is logged in
	//eles throw exception
	hubsRepository.getHub(id, function(hub){
		console.log("data from manager" + hub)
		callback(hub)
	})
}

exports.subscribeTo = function(hubId, userId){
	if(!hubsRepository.subscribeTo(hubId,userId)){
		throw "Could not subscribe!"
	}
}