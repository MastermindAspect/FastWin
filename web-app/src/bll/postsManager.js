module.exports = function({postsRepository, usersRepository}) {
    return {
        createPost: function(title, content, hubId, loggedIn, userId, callback) {
            let errors = []
        
            if (loggedIn) {
                if (title.length == 0) {
                    errors.push("You need to write a title")
                }
                if (content.length == 0) {
                    errors.push("You need to write some content")
                }
                usersRepository.getUserById(userId, function(user, error) {
                    if (error) {
                        callback(null, "Error getting user")
                    } else {
                        if (!user) {
                            errors.push("Something went wrong")
                        }
                        if (errors.length == 0) {
                            postsRepository.createPost(user.username, title, content, hubId, userId, function (err) {
                                if (err) {
                                    callback(null, "Error creating post")
                                } else {
                                    callback(null, null)
                                }
                            })
                        } else {
                            callback(errors, null)
                        }
                    }
                })
        
            } else {
                errors.push("You need to be logged in to create a post")
                callback(errors, null)
            }
            
        },
        
        deletePost: function(loggedIn, userId, postId, callback) {
            let errors = []
            postsRepository.getPostById(postId, function(post, err) {
                if (err) {
                    callback(null, "Error getting post, the post you are trying to delete may already be deleted")
                } else {
                    if (!post) {
                        errors.push("The post does not exist anymore")
                    }
                    if (!loggedIn) {
                        errors.push("You need to be logged in to delete a post")
                    } else if (post.userId != userId) {
                        errors.push("You don't have right authority to delete this post")
                    }
                    if (errors.length == 0) {
                        postsRepository.deletePost(postId, function (err) {
                            if (err) {
                                callback(null, "Error deleting post")
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
        
        updatePost: function (title, content, postId, loggedIn, userId, callback) {
            let errors = []
            if (loggedIn) {
                if (title.length == 0) {
                    errors.push("You need to write a title")
                }
                if (content.length == 0) {
                    errors.push("You need to write some content")
                }
        
                postsRepository.getPostById(postId, function (post, err) {
                    if (err) {
                        callback(null, "Error getting post, the post you are trying to update may be deleted")
                    } else if (post) {
                        if (post.userId != userId) {
                            errors.push("You do not have the right authority to update this post")
                        }
                        if (errors.length == 0) {
                            postsRepository.updatePost(postId, title, content, function (err) {
                                if (err) {
                                    callback(null, "Error updating post")
                                } else {
                                    callback(null, null)
                                }
                            })
                        } else {
                            callback(errors, null)
                        }
        
                    } else {
                        errors.push("The post does not exist anymore")
                        callback(errors, null)
                    }
                })
            } else {
                errors.push("You need to be logged in to edit a post")
                callback(errors, null)
            }
        },
        
        getHubPosts: function(hubId, callback) {
            postsRepository.getHubPosts(hubId, function(posts, err) {
                if (err) {
                    callback(null, "Error getting hub-posts")
                } else {
                    callback(posts, null)
                }
            })
        },

        getPostById: function(postId, callback) {
            postsRepository.getPostById(postId, function(post, err) {
                if (err) {
                    callback(null, "Error getting post")
                } else {
                    callback(post, null)
                }
            })
        }
    }

}
