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
	//check if user is logged in
	//eles throw exception
	hubsRepository.subscribeTo(hubId, userId, function(err){
		if (err) throw "could not subscribe to hub!"
	})
}

exports.unSubscribeTo = function(hubId, userId){
	//check if user is logged in
	//eles throw exception
	hubsRepository.unSubscribeTo(hubId, userId, function(err){
		if (err) throw "could not unsubscribe to hub!"
	})
}

exports.getMembers = function(hubId, callback){
	hubsRepository.getMembers(hubId, function(users, err){
		if (err) throw "could not get members"
		else callback(users)
	})
}

exports.getAllHubsByUser = function(userId, callback){
	hubsRepository.getAllHubsByUser(userId, function(hubs, err){
		if (err) throw "could not get hubs"
		else callback(hubs)
	})
}