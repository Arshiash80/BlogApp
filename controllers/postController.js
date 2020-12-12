const Author = require('../models/author');
const Post = require('../models/post')

const async = require('async')
const { body, validationResult } = require("express-validator")


// Display Posts list page. -GET-
exports.posts_list = (req, res, next) => {
    async.parallel({
        posts: (callback) => {
            Post.find({ status: "Public" })
                .populate('author')
                .sort({ likes: -1 ,created_date: -1 }) 
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
    res.render("post_create", { title:"Create A Post", auth: req.user })
}

// Handle create Post form. -POST-
exports.post_create_post = [

    // Validate and sanitise fields.
    body('title', "Title is required.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('content', "Content is too short. (min 100 characters)")
        .trim()
        .isLength({ min: 100 })
        .escape(),
    body('status')
        .trim()
        .escape(),
    (req, res, next) => {
        let input_data = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            // There is some validation errors. Render the page again with errors and input data.
            res.render("post_create", { title:"Create A Post", auth: req.user, errors: errors.array(), post: input_data })
        } else {
            // Input data is clear. So create new post.
            let new_post = new Post({
                author: req.user._id,
                title: input_data.title,
                content: input_data.content,
                status: input_data.status,
            })

            new_post.save().catch(err => { next(err) })
            // Successful - redirect to home page.
            res.redirect('/')
        }
    }
]






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
