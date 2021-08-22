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
			db.query("SELECT * FROM posts WHERE id = ?", [postId], function(error, postResults) {
				if (error) {
					callback(null, "error getting post")
				} else {
					callback(postResults[0], null)
				}
			})
		},
		
		createPost: function(author, title, content, hubId, userId, callback) {
			data = [hubId, userId, author, title, content]
			db.query("INSERT INTO posts (hubId, userId, author, title, content) VALUES (?, ?, ?, ?, ?)", data, function(error){
				if (error) {
					callback("Error creating post")
				} else {
					callback(null)
				}
			})
		},
		
		deletePost: function(postId, callback) {
			db.query("DELETE FROM posts WHERE id = ?", [postId], function(error) {
				if (error) {
					callback("Error deleting post")
				} else {
					callback(null)
				}
			})
		},
		
		updatePost: function(postId, title, content, callback) {
			const data = [title, content, postId]
			db.query("UPDATE posts SET title = ?, content = ? WHERE id = ?", data, function(error) {
				if (error) {
					callback("Error updating post")
				} else {
					callback(null)
				}
			})
		},
		
		getHubPosts: function(hubId, callback) {
			db.query("SELECT * FROM posts WHERE hubId = ?", [hubId], function(error, posts) {
				if (error) {
					callback(null, "Error getting posts")
				} else {
					callback(posts, null)
				}
			})
		}
	}
}