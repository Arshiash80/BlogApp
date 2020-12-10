const async = require('async')
var path = require('path');

const Author = require('./models/author')
const Post = require('./models/post')

// Config environment variables. - (.env)
require('dotenv').config({ path: path.join(__dirname, '/configs/.env') })

// Setup mongoose connection
const mongoose = require('mongoose')
const mongoDB = process.env.DEV_DB_URL
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let authors = []
let posts = []


function authorCreate(first_name, family_name, username, email, password, cb) {
    let author_detail = {
        first_name,
        family_name,
        username,
        email,
        password,
    }
    
    let author = new Author(author_detail)
    author.save(function(err) {
        if (err) { return console.log(err) }
        console.log('New Author: ' + author);
        authors.push(author)
        cb(null, author)
    })
}

function postCreate(author, title, content, cb) {
    let postDetail = {
        author,
        title,
        content,
    }
    let post = new Post(postDetail)
    post.save(function(err) {
        if (err) { return console.log(err) }
        console.log('New Post: ' + post);
        posts.push(post)
        cb(null, post)
    })

}

function createAuthor(cb) {
    async.series([
        (callback) => {
            authorCreate("TestUser_FN", "TestUser_LN", "TestUser", "testuser@demo.com", "12345", callback)
        },
        (callback) => {
            authorCreate("TestUser_FN2", "TestUser_LN2", "TestUser2", "testuser2@demo.com", "12345", callback)
        },
        (callback) => {
            authorCreate("TestUser_FN3", "TestUser_LN3", "TestUser3", "testuser3@demo.com", "12345", callback)
        }
    ], cb)
}
function createPost(cb) {
    async.series([
        (callback) => {
            postCreate(authors[1], "Test Post1", "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).", callback)
        },
        (callback) => {
            postCreate(authors[2], "Test Post2", "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).", callback)
        },
        (callback) => {
            postCreate(authors[0], "Test Post3", "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).", callback)
        }
    ], cb)
}

async.series([
    createAuthor,
    createPost,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});