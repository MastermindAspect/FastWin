const express = require("express");

module.exports = function ({ postsManager }) {

    const router = express.Router();

    router.post("/create/:hubId", (req, res) => {
        const title = req.body.title
        const content = req.body.content
        const hubId = req.params.hubId
        postsManager.createPost(title, content, hubId, req.session, function (errors, databaseErrors) {
            if (databaseErrors.length > 0) {
                const error = "Something went wrong when trying to create the post"
                const modal = {
                    error
                }
                res.render("error", modal)
            } else if (errors.length > 0) {
                const modal = {
                    title,
                    content,
                    errors
                }
                res.render("", modal)
            } else {
                res.redirect("hubs_hub") //Lägg till funktion för att hämta posts o.s.v
            }
        })
    })

    router.post("/update/:postId", (req, res) => {
        const title = req.body.title
        const content = req.body.content
        const postId = req.params.postId
        postsManager.updatePost(title, content, postId, req.session, function (errors, databaseErrors) {
            if (databaseErrors.length > 0) {
                const error = "Something went wrong when trying to update the post"
                const modal = {
                    error
                }
                res.render("error", modal)
            } else if (errors.length > 0) {
                const modal = {
                    title,
                    content,
                    errors
                }
                res.render("", modal) //Lägg till sidan vi ska till
            }
        })
    })

    return router

}
