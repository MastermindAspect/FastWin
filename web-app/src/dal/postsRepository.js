module.exports = function({db}) {
	return {
		getPostById: function(postId, callback) {
			db.Post.findOne({
				where: {id: postId}
			})
				.then(function(post){
					if (post) {
						callback(post.dataValues, null)
					} else {
						callback(null, null)
					}
				})
				.catch(function(error){
					console.log(error)
					callback(null, "Error getting post")
				})
		},
		
		createPost: function(author, title, content, hubId, userId, callback) {
			db.Post.create({author: author, hubId: hubId, userId: userId, title: title, content: content})
                .then(function(){
                    callback(null)
                })
                .catch(function(error) {
                    callback("Error creating post")
                })
		},
		
		deletePost: function(postId, callback) {
			db.Post.destroy({
				where: {id: postId}
			})
				.then(function(){
					callback(null)
				})
				.catch(function(error){
					callback("Error deleting post")
				})
		},
		
		updatePost: function(postId, title, content, callback) {
			db.Post.update({
				title: title,
				content: content
			}, {
				where: {id: postId}
			})
				.then(function(){
					callback(null)
				})
				.catch(function(error) {
					callback("Error updating post")
				})
		},
		
		getHubPosts: function(hubId, callback) {
			db.Post.findAll({
				where: {hubId: hubId}
			})
			.then(function(posts){
				plainPosts = []
				for (post in posts) {
					plainPosts.push(posts[post].dataValues)
				}
				console.log(plainPosts)
				callback(plainPosts, null)
			})
			.catch(function(error){
				callback(null, "Error getting posts")
			})
		}
	}
}

