
module.exports = function({hubsRepository}){
	return {
		getAllHubs: function(callback){
			hubsRepository.getAllHubs(function (hubs, error) {
				if (error) {
					console.log(error)
					callback(null, "Error getting hubs")
				} else {
					callback(hubs, null)
				}
			})
		},
		createHub: function(userId, hubName, description, game, loggedIn, callback){
			errors = []
			if (hubName == "") {
				errors.push("You need to write a title")
			}
			if (description == "") {
				errors.push("You need to write a description")
			}
			if (game == "") {
				errors.push("You need to specify a game")
			}
			if (!loggedIn) {
				errors.push("You need to be logged in to create a hub")
			}
			if (errors.length == 0){
				hubsRepository.createHub(userId, hubName, description, game, function(id, err){
					if (err) {
						callback(null, null, "Error creating hub")
					} else {
						callback(id, null, null)
					}
				})
			} else {
				callback(null, errors, null)
			}
		},
		getHub: function(id, callback){
			hubsRepository.getHub(id, function(hub,err){
				if (err) {
					callback(null, err)
				} else {
					callback(hub, null)
				}
			})
		},
		subscribeTo: function(hubId,loggedin, userId, callback){
			if (loggedin){
				hubsRepository.getHub(hubId, function(hub, err){
					if (err) {
						callback(null, "Error getting hub")
					} else {
						hubsRepository.subscribeTo(hub.id, userId, function(err){
							if (err) {
								callback(null, "Error subscribing to hub")
							} else {
								callback(null, null)
							}
						})
					}
				})
			}else {
				callback("You need to be logged in to subscribe to a hub", null)
			}
		},
		unSubscribeTo: function(hubId, loggedin, userId, callback){
			if(loggedin){
				hubsRepository.getHub(hubId, function(hub,err){
					if (err) {
						callback(null, "Could not find hub")
					} else {
						hubsRepository.unSubscribeTo(hub.id, userId, function(err){
							if (err) {
								callback(null, "Could not unsubscribe from hub")
							} else {
								callback(null, null)
							}
						})
					}
				})
			}else {
				callback("You need to be logged in to unsubscribe", null)
			}
		},
		getMembers: function(hubId, callback){
			hubsRepository.getHub(hubId, function(hub, err){
				if (err) {
					callback(null, "Hub was not found")
				} else {
					hubsRepository.getMembers(hub.id, function(users, err){
						if (err) {
							callback(null, "Error getting members")
						} else {
							callback(users, null)
						}
					})
				}
			})
		},

		deleteHub: function(hubId, userId, loggedIn, callback) {
			let errors = []
            hubsRepository.getHub(hubId, function(hub, err) {
                if (err) {
                    callback(null, "Error getting hub")
                } else {
                    if (!hub) {
                        errors.push("The hub does not exist anymore")
                    }
                    if (!loggedIn) {
                        errors.push("You need to be logged in to delete a hub")
                    } else if (hub.userId != userId) {
                        errors.push("You don't have right authority to delete this hub")
                    }
                    if (errors.length == 0) {
                        hubsRepository.deleteHub(hubId, function (err) {
                            if (err) {
                                callback(null, "Error deleting hub")
                            } else {
                                callback(null, null)
                            }
                        })
                    } else {
                        callback(errors, null)
                    }
                }
            })
		},

		updateHub: function (hubId, userId, hubName, description, game, loggedIn, callback) {
            let errors = []
            if (loggedIn) {
                if (hubName.length == 0) {
                    errors.push("You need to write a name")
                }
                if (description.length == 0) {
                    errors.push("You need to write some description")
				}
				if (game.length == 0) {
					errors.push("You need to choose a game")
				}
                hubsRepository.getHub(hubId, function (hub, err) {
                    if (err) {
                        callback(null, "Error getting post, the post you are trying to update may be deleted")
                    } else if (hub) {
						if (hub.userId != userId) {
                            errors.push("You do not have the right authority to update this hub")
                        }
                        if (errors.length == 0) {
                            hubsRepository.updateHub(hubId, hubName, description, game, function (err) {
                                if (err) {
                                    callback(null, "Error updating hub")
                                } else {
                                    callback(null, null)
                                }
                            })
                        } else {
                            callback(errors, null)
                        }
        
                    } else {
                        errors.push("The hub does not exist anymore")
                        callback(errors, null)
                    }
                })
            } else {
                errors.push("You need to be logged in to edit a hub")
                callback(errors, null)
            }
		},
		
		getAllHubsByUser: function(userId, loggedin,callback){
			if (loggedin && userId){
				hubsRepository.getAllHubsByUser(userId, function(hubs, err){
					if (err) {
						callback(null, null, "Can't get hubs")
					} else {
						plainHubs = []
						for (hub in hubs) {
							plainHubs.push(hubs[hub].dataValues)		//Vrf funkar denna på detta sättet?? (som den utkommenterade loopen)
						}
						// for (let i = 0; i < hubs.length; i++) {
						// 	plainHubs.push(hubs[i].dataValues)
						// }
						callback(plainHubs, null, null)
					}
				})
			}else {
				callback(null, "Please log in to se this page", null)
			}
		},
		isSubscribed: function(hubId, userId, callback){
			hubsRepository.getMembers(hubId,function(subscribers, err){
				if (err) {
					callback(null, "Error checking if user is subbed")
				} else {
					let subbed = false
					for (sub in subscribers) {
						if (subscribers[sub].id == userId) {       //Vrf funkar det såhär? subscribers[sub].id och inte bara sub.id?
							subbed = true
						}
					}
					callback(subbed, null)
				}
			})
		},

		getMostUsedHubs: function(userId, callback) {
            hubsRepository.getMostUsedHubs(userId, function(hubs, err) {
				if (err) {
					console.log(err)
					callback(hubs, "Error getting most used hubs")
				} else {
					callback(hubs, null)
				}
            })
        }
	}
}
