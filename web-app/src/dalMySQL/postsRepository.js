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
					callback(null, error)
				} else {
					callback(postResults[0], error)
				}
			})
		},
		
		createPost: function(author, title, content, hubId, userId, callback) {
			data = [hubId, userId, author, title, content]
			db.query("INSERT INTO posts (hubId, userId, author, title, content) VALUES (?, ?, ?, ?, ?)", data, function(error){
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
			db.query("UPDATE posts SET title = ?, content = ? WHERE id = ?", data, function(error) {
				console.log("Error" + error)
				callback(error)
			})
		},
		
		getHubPosts: function(hubId, callback) {
			db.query("SELECT * FROM posts WHERE hubId = ?", [hubId], function(error, posts) {
				if (error) {
					callback(null, error)
				} else {
					callback(posts, null)
				}
			})
		}
	}
}