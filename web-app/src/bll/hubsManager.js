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

exports.createHub = function(values, loggedin, callback){
	//check if user is logged in
	//eles throw exception
	if (loggedin){
		hubsRepository.createHub(values, function(id, err){
			if (err) throw "Could not create hub!"
			else callback(id)
		})
	}
	else {
		throw "You need to be logged in to create a hub!"
	}

}

exports.getHub = function(id, callback){
	//check if user is logged in
	//eles throw exception
	hubsRepository.getHub(id, function(hub,err){
		console.log("data from manager" + hub)
		if (err) throw "could not get hub"
		callback(hub)
	})
}

exports.subscribeTo = function(hubId,loggedin, userId){
	if (loggedin){
		hubsRepository.getHub(hubId, function(hub, err){
			if (err) throw "could not get hub"
			hubsRepository.subscribeTo(hub.id, userId, function(err){
				if (err) throw "could not subscribe to hub!"
			})
		})
	}else{
		throw "You need to be logged in to be able to subscribe!"
	}
}

exports.unSubscribeTo = function(hubId, userId){
	if(loggedin){
		hubsRepository.getHub(hubId, function(hub,err){
			if (err) throw "Hub not found!"
			hubsRepository.unSubscribeTo(hub.id, userId, function(err){
				if (err) throw "Could not unsubscribe to hub!"
			})
		})
	} else{
		throw "You need to be logged in to unsubscribe!"
	}
}

exports.getMembers = function(hubId, callback){
	hubsRepository.getHub(hubId, function(hub, err){
		if (err) throw "Hub not found!"
		hubsRepository.getMembers(hub.id, function(users, err){
			if (err) throw "could not get members"
			else callback(users)
		})
	})
}

exports.getAllHubsByUser = function(userId, loggedin,callback){
	if (loggedin && userId){
		hubsRepository.getAllHubsByUser(userId, function(hubs, err){
			if (err) throw "could not get hubs"
			else callback(hubs)
		})
	}else{
		throw "Please login to view this page"
	}
}