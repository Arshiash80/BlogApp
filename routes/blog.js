const express = require('express')
const { route } = require('.')
const router = express.Router()

const auth = require('../configs/auth')

const authorController = require('../controllers/authorController')
const postController = require('../controllers/postController')


// || AUTHOR ROUTES|| 
// +++++++++++++++++

// GET request for display Authors list page.
router.get("/authors", auth.esureAuthenticated,authorController.authors_list)

// GET requst for display Author profile page.
router.get("/author/profile", auth.esureAuthenticated, authorController.author_profile)

// GET requst for edit Author profile
router.get("/author/profile/edit", auth.esureAuthenticated, authorController.author_editProfile_get)

// POST requst for edit Author profile
router.post("/author/profile/edit", auth.esureAuthenticated, authorController.author_editProfile_post)

// GET requst for delete account
router.get("/author/profile/delete", auth.esureAuthenticated, authorController.author_deleteProfile_get)

// POST requst for delete account
router.post("/author/profile/delete", auth.esureAuthenticated, authorController.author_deleteProfile_post)

// GET request for display Author register form page.
router.get('/author/register', authorController.author_register_get)

// POST request for display Author register form page.
router.post('/author/register', authorController.author_register_post)

// GET request for display Author login form page.
router.get('/author/login', authorController.author_login_get)

// POST request for display Author login form.
router.post('/author/login', authorController.author_login_post)

// GET request for Author logout.
router.get('/author/logout', authorController.author_logout)

// GET requst for display Author detail page.
router.get("/author/:id", authorController.author_detail)


// || POST ROUTES|| 
// +++++++++++++++++

// GET request for creating Post form page.
router.get('/post/create', auth.esureAuthenticated,postController.post_create_get)

// POST request for creating Post form.
router.get('/post/create', auth.esureAuthenticated,postController.post_create_post)

// GET request for posts list page.
router.get('/posts', postController.posts_list)

// GET request for post detail page.
router.get('/post/:id', postController.post_detail)

// GET request for update post form.
router.get('/post/:id/update', auth.esureAuthenticated,postController.post_update_get)

// POST request for update post form.
router.post('/post/:id/update', auth.esureAuthenticated,postController.post_update_post)

// GET request for delete post.
router.get('/post/:id/delete', auth.esureAuthenticated,postController.post_delete_get)

// POST request for delete post.
router.post('/post/:id/delete', auth.esureAuthenticated,postController.post_delete_post)



module.exports = router