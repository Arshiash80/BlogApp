
module.exports = {
    esureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            // console.log(req.user)
            return next()
        } else {
            req.flash("error_msg", "Please log in to view this page!")
            res.redirect('/blog/author/login')
        }
    },
    esureNotAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            req.flash("error_msg", "Youre already logged in.")
            res.redirect('/blog/posts')
        } else {
            
            return next()
        }
    }
}

