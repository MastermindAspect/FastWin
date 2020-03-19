// const mysql = require("mysql")

// const db1 = mysql.createConnection({
// 	host: "db",
// 	user: "root",
// 	password: "abc123",
// 	database: "myDB"
// })


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
					callback(null, error)
				})
		},
		
		createPost: function(author, title, content, hubId, userId, callback) {
			db.Post.create({author: author, hubId: hubId, userId: userId, title: title, content: content})
                .then(function(){
                    callback(null)
                })
                .catch(function(error) {
                    callback(error)
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
					callback(error)
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
					callback(error)
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
				callback(null, error)
			})
		}
	}
}

