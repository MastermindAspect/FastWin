module.exports = function({postsRepository}) {
    return {
        createPost: function(title, content, hubId, session, callback) {
            let errors = []
            let databaseErrors = []
        
            if (!session.loggedIn) {
                if (title.length == 0) {
                    errors.push("You need to write a title")
                }
                if (content.length == 0) {
                    errors.push("You need to write some content")
                }
        
                if (errors.length > 0) {
                    postsRepository.createPost(title, content, hubId, session.userId, function (err) {
                        if (err) {
                            databaseErrors.push(err)
                        }
                        callback(errors, databaseErrors)
                    })
                } else {
                    callback(errors, databaseErrors)
                }
        
            } else {
                errors.push("You need to be logged in to create a post")
                callback(errors, databaseErrors)
            }
            
        },
        
        deletePost: function(session, postId, callback) {
            let errors = []
            postsRepository.getPostById(postId, function(err, post) {
                if (err) {
                    //Handle error
                } else {
                    if (!post) {
                        errors.push("The post does not exist anymore")
                    }
                    if (!session.loggedIn) {
                        errors.push("You need to be logged in to delete a post")
                    } else if (post.userId != session.userId) {
                        errors.push("You don't have right authority to delete this post")
                    }
                    if (errors.length == 0) {
                        postsRepository.deletePost(postId, function(err) {
                            if (err) {
                                //Handle error
                            } else {
                                callback(errors)
                            }
                        })
                    } else {
                        callback(errors)
                    }
                }
            })
        },
        
        updatePost: function (title, content, postId, session, callback) {
            let errors = []
            let databaseErrors = []
            if (!session.loggedIn) {
                if (title.length == 0) {
                    errors.push("You need to write a title")
                }
                if (content.length == 0) {
                    errors.push("You need to write some content")
                }
        
                postsRepository.getPostById(postId, function (post, err) {
                    if (err) {
                        databaseErrors.push(err)
                    } else if (post) {
                        if (post.userId != session.userId) {
                            errors.push("You do not have the right authority to update this post")
                        }
                        if (errors.length > 0) {
                            postsRepository.updatePost(title, content, session.userId, function (err) {
                                if (err) {
                                    databaseErrors.push(err)
                                }
                                callback(errors, databaseErrors)
                            })
                        } else {
                            callback(errors, databaseErrors)
                        }
        
                    } else {
                        errors.push("The post does not exist anymore")
                        callback(errors, databaseErrors)
                    }
                })
            } else {
                errors.push("You need to be logged in to edit a post")
                callback(errors, databaseErrors)
            }
        },
        
        getHubPosts: function(hubId, callback) {
            postsRepository.getHubPosts(hubId, function(posts, err) {
                if (err) {
                    throw error
                }
                else {
                    callback(posts)
                }
                 
            })
        }
    }

}
