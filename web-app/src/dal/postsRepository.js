const mysql = require("mysql")

const db = mysql.createConnection({
	host: "db",
	user: "root",
	password: "abc123",
	database: "myDB"
})

module.exports = function({}) {
	return {
		getPostById: function(postId, callback) {
			db.query("SELECT * FROM posts WHERE id = ?", [postId], function(error, post) {
				callback(post[0], error)
			})
		},
		
		createPost: function(title, content, hubId, userId, callback) {
			data = [hubId, userId, title, content]
			db.query("INSERT INTO posts (hubId, userId, title, content) VALUES (?, ?, ?, ?)", data, function(error){
				// TODO: Also handle errors.
				callback(error)
			})
		},
		
		deletePost: function(postId, callback) {
			db.query("DELETE FROM posts WHERE id = ?", [postId], function(error) {
				callback(error)
			})
		},
		
		updatePost: function(postId, title, content, callback) {
			const data = [title, content, postId]
			db.query("UPDATE posts SET title = ?, content = ? WHERE id = ?", [data], function(error) {
				callback(error)
			})
		},
		
		getHubPosts: function(hubId, callback) {
			db.query("SELECT * FROM posts WHERE hubId = ?", [hubId], function(error, posts) {
				callback(posts, error)
			})
		}
	}
}

