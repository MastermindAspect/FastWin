const express = require("express");

module.exports = function ({ postsManager }) {

    const router = express.Router();

    router.post("/create/:hubId", (req, res) => {
        const title = req.body.postTitle
        const content = req.body.postContent
        const hubId = req.params.hubId
        postsManager.createPost(title, content, hubId, req.session, function (errors, dbError) {
            if (dbError) {
                const model = {
                    error: [dbError]
                }
                res.render("error.hbs", model)  
            } else if (errors) {
                const modal = {
                    postTitle: title,
                    postConetnt: content,
                    errors
                }
                res.render("", modal)
            } else {
                res.redirect("../../hubs/" + hubId)
            }
        })
    })

    router.get("/update/:postId", (req, res) => {
        const postId = req.params.postId
        postsManager.getPostById(postId, function (post, dbError) {
            if (dbError) {
                const model = {
                    error: [dbError]   
                }             
                res.render("error.hbs", model)
            } else {
                const model = {
                    post
                }
                res.render("updatePost.hbs", model)
            }
        })
    })

    router.post("/update/:postId", (req, res) => {
        const title = req.body.title
        const content = req.body.content
        const postId = req.params.postId
        postsManager.updatePost(title, content, postId, req.session, function (errors, dbError1) {
            postsManager.getPostById(postId, function (post, dbError2) {
                if (dbError1 || dbError2) {
                    const model = {
                        error: [dbError1, dbError2]
                    }
                    res.render("error.hbs", model)
                } else if (errors) {
                    console.log(errors)
                    const modal = {
                        post,
                        errors
                    }
                    res.render("updatePost", modal)
                }
                else {
                    res.redirect("../../hubs/" + post.hubId)
                }
            })
        })
    })

    router.post("/delete/:hubId/:postId", (req, res) => {
        const hubId = req.params.hubId
        const postId = req.params.postId
        postsManager.deletePost(req.session, postId, function(errors, dbError) {
            if (dbError) {
                const model = {
                    error: [dbError]
                }
                res.render("error.hbs", model)
            } else if (errors) {
                const model = {
                    error: errors
                }
                res.render("error.hbs", model)
            } else {
                res.redirect("../../../hubs/" + hubId)
            }
        })
    })

    return router

}
