const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt')

const Author = require('../models/author')

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    { usernameField: "email", passwordField: "password" },  
    function(username, password, done) {
        // Find the author with username that passed. 
        Author.findOne({ email: username }, function (err, author) {
          if (err) { return done(err); }
          if (!author) { 
            // username is incoorect
            return done(null, false, { message: 'Incorrect email.' }); 
          }
          
          // Checking the password
          bcrypt.compare(password, author.password, (err, isMatch) => {
            if (err) { return done(err) }
            if (!isMatch) {
              // Password is incorrect.
              return done(null, false, { message: 'Incorrect password.' }); 
            }
            // Password is correct.
            return done(null, author);
          })
          // Data is correct. Author can login.
      });
    }
  ));

  passport.serializeUser(function(author, done) {
    done(null, author.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Author.findById(id, function(err, author) {
      done(err, author);
    });
  });
} 