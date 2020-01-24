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