const Author = require('../models/author');
const Post = require('../models/post')

const async = require('async')


// Display Posts list page. -GET-
exports.posts_list = (req, res, next) => {
    async.parallel({
        posts: (callback) => {
            Post.find()
                .populate('author')
                .exec(callback)
        }
    }, (err, results) => {
        if (err) { return next(err) }
        // Successfull - render the home page.
        res.render('index', { title:"Posts List", posts: results.posts, auth: req.user })
    })
}

// Displat Post detail page. -GET-
exports.post_detail = (req, res, next) => {
    res.send(`NOT IMPLEMENTED. id: ${req.params.id}`)
}

// Display create Post form. -GET-
exports.post_create_get = (req, res, next) => {
    res.send("NOT IMPLEMENTED.")
}

// Handle create Post form. -POST-
exports.post_create_post = (req, res, next) => {
    res.send("NOT IMPLEMENTED.")
}

// Display Post update form. -GET-
exports.post_update_get = (req, res, next) => {
    res.send(`NOT IMPLEMENTED. id: ${req.params.id}`)
}

// Handle Post update form. -POST-
exports.post_update_post = (req, res, next) => {
    res.send(`NOT IMPLEMENTED.`)
}

// Display Post delete form. -GET-
exports.post_delete_get = (req, res, next) => {
    res.send(`NOT IMPLEMENTED. id: ${req.params.id}`)
}

// Handle Post delete form. -POST- 
exports.post_delete_post = (req, res, next) => {
    res.send(`NOT IMPLEMENTED.`)
}
