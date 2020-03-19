
module.exports = function({hubsRepository}){
	return {
		getAllHubs: function(callback){
			try {
				hubsRepository.getAllHubs(function(hubs){
					// TODO: Also handle errors.
					callback(hubs)
				})
			}
			catch(error){
				throw error
			}
		},
		createHub: function(values, loggedin, callback){
			if (loggedin){
				hubsRepository.createHub(values, function(id, err){
					if (err) throw err
					else callback(id)
				})
			}
			else {
				throw "You need to be logged in to create a hub!"
			}
		},
		getHub: function(id, callback){
			hubsRepository.getHub(id, function(hub,err){
				if (err) throw "Error getting hub"
				callback(hub)
			})
		},
		subscribeTo: function(hubId,loggedin, userId){
			if (loggedin){
				hubsRepository.getHub(hubId, function(hub, err){
					if (err) throw "could not get hub"
					hubsRepository.subscribeTo(hub.id, userId, function(err){
						if (err) throw err
					})
				})
			}else{
				throw "You need to be logged in to be able to subscribe!"
			}
		},
		unSubscribeTo: function(hubId, loggedin,userId){
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
		},
		getMembers: function(hubId, callback){
			hubsRepository.getHub(hubId, function(hub, err){
				if (err) throw "Hub not found!"
				hubsRepository.getMembers(hub.id, function(users, err){
					if (err) throw "could not get members"
					else callback(users)
				})
			})
		},
		getAllHubsByUser: function(userId, loggedin,callback){
			if (loggedin && userId){
				hubsRepository.getAllHubsByUser(userId, function(hubs, err){
					if (err) throw "cant get hubs"
					else callback(hubs)
				})
			}else{
				throw "Please login to view this page"
			}
		},
		isSubscribed: function(hubId, userId, callback){
			hubsRepository.isSubscribed(hubId, userId,function(isSubbed){
				callback(isSubbed)
	
			})
		}
	}
}
