const hubsRepository = require('../dal/hubsRepository')

exports.getAllHubs = function(callback){
	hubsRepository.getAllHubs(function(hubs){
		// TODO: Also handle errors.
		callback(hubs)
	})
}