const Author = require('../models/author');
const Post = require('../models/post')
const { body, validationResult } = require("express-validator")
const bcrypt = require('bcrypt')

const passport = require('passport')

const async = require('async');
const auth = require('../configs/auth');
const { RequestTimeout } = require('http-errors');


// TODO: Implement authors list page.
// /////////////////////////////////////////
// Display list of all authors. -GET-
exports.authors_list = (req, res, next) => {
    res.send("NOT IMPLEMENTED")
}
// /////////////////////////////////////////




// TODO: Implent Author detail page.
// /////////////////////////////////////////
// Display author detail page. -GET-
exports.author_detail = (req, res, next) => {
    res.send(`author_detail id: ${req.params.id}`)
}
// /////////////////////////////////////////



// Display author profile. -GET-'
exports.author_profile = (req, res, next) => {
    res.render("author_profile", { title: "Profile", auth: req.user })
}

// Display author profile edit form. -GET-
exports.author_editProfile_get = (req, res, next) => {
    res.render("author_register", { title:"Edit profile", auth: req.user })
}
// Handle author profile edit form. -POST-
exports.author_editProfile_post = [

    // Validate and sanitise fieldss.
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),

    body('family_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Last name must be specified.')
        .isAlphanumeric()
        .withMessage('Last name has non-alphanumeric characters.'),

    body('username')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Username name must be specified.')
        .isAlphanumeric()
        .withMessage('Username name has non-alphanumeric characters.'),

    body('email')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Email must be specified.'),

    async (req, res, next) => {
        // Data comming from form
        let input_data = req.body


        // Extract the validation errors from a request.
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_register', { title: "Edit profile", logged_in: false, author: input_data, auth: req.user, errors: errors.array() })
        } else {
            Author.findById(req.user._id)
                .then(author => {
                    author.first_name = input_data.first_name
                    author.family_name = input_data.family_name
                    author.username = input_data.username
                    author.email = input_data.email
                    author.save()
                }).then(() => {
                    return res.redirect('/blog/author/profile')
                })
                .catch(err => {
                    return next(err)
                })
        }
    }
]

// Display Author register form. -GET-
exports.author_register_get = (req, res, next) => {
    res.render('author_register', { title: "Register", logged_in: false })
}

// Handle Author register form. -POST-
exports.author_register_post = [
    
    // Validate and sanitise fieldss.
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),

    body('family_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Last name must be specified.')
        .isAlphanumeric()
        .withMessage('Last name has non-alphanumeric characters.'),

    body('username')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Username name must be specified.')
        .isAlphanumeric()
        .withMessage('Username name has non-alphanumeric characters.'),

    body('email')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Email must be specified.'),

    body('password')
        .trim()
        .isLength({ min: 4 })
        .withMessage('password must be at least 4 characters')
        .escape(),
    
    body('confirm_password')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Password required.')
        .custom((value,{req, loc, path}) => { // Check's if password2 is iqual to password.
          if (value !== req.body.password) {
              // trow error if passwords do not match.
              throw new Error("Passwords don't match");
          } else {
              return value;
          }
        }),

        // Process request after validation and sanitization.
        async (req, res, next) => {
            // Data comming from form
            let input_data = req.body

            // Check the email field again!
            input_data.email += '@gmail.com'
            await body('email')
                .isEmail().withMessage("Enter a valid email adress without '@gmail.com'.")
                .run(req);
            input_data.email = input_data.email.replace('@gmail.com','')

            // Extract the validation errors from a request.
            const errors = validationResult(req)
            
            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values/errors messages.
                res.render('author_register', { title: "Register", logged_in: false, author: input_data, errors: errors.array() })
            } else {
                // There is no error.
                // Data from form is valid.
                bcrypt.genSalt(10, function(err, salt) {
                    if(err) { return next(err) }
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        if(err) { return next(err) }
                        // Store new Author with hashed password for DB.
                        let new_author = new Author({
                            first_name: input_data.first_name,
                            family_name: input_data.family_name,
                            username: input_data.username,
                            email: input_data.email + "@gmail.com",
                            password: hash,
                        })

                        // Check the Author is exists.
                        Author.findOne({ email: new_author.email })
                            .then(author => {
                                if (author) {
                                    // Author is exists. Render the page with the error
                                    res.render('author_register', { title:"Register", author: input_data, errors: [{ msg:`An Author with "${input_data.email}@gmail.com" email adress is exists.` }] })
                                } else {
                                    Author.findOne({ username: new_author.username })
                                        .then(author => {
                                            if (author) {
                                                res.render('author_register', { title:"Register", author: input_data, errors: [{ msg:`'@${new_author.username}' username currently in use by someone else.` }] })

                                            } else {
                                                // Author not exists. So save the new Author.
                                                new_author.save(function(err) {
                                                    if (err) { next(err) }
                                                    // Successful - Redirect to login form.
                                                    res.redirect('/blog/author/login')
                                                })
                                            }
                                        })
                                    
                                }
                            })
                    });
                });
            
            }
        }
]

// Display Author delete profile page. -GET-
exports.author_deleteProfile_get = (req, res, next) => {
    res.render("author_delete", { title: `Delete ${req.user._id}`, auth: req.user })
}

// Handle Author delete account request. -POST-
exports.author_deleteProfile_post = (req, res, next) => {
    console.log(req.body.authorEnsure)
    console.log(req.user.username)
    if (req.body.authorEnsure === req.user.username) {
        console.log("Here")
        Author.findByIdAndRemove(req.user._id, {}, (err, author) => {
            if (err) { return next(err) }
            author.save()

        })
        res.redirect('/')
    } else {
        res.render("author_delete", { title: `Delete ${req.user._id}`, auth: req.user })
    }
}


// Display Author login form. -GET-
exports.author_login_get = (req, res, next) => {
    res.render('author_login', { title: "Login", logged_in: false })
}

// Handle Author login form. -POST-
exports.author_login_post = (req, res, next) => {
    passport.authenticate('local', { 
        successRedirect: '/blog/posts',
        failureRedirect: '/blog/author/login',
        failureFlash: true 
    })(req, res, next)
}
// Display Author logout form. -GET-
exports.author_logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}