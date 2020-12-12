var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session')
const passport = require('passport')

const flash = require('connect-flash')

var indexRouter = require('./routes/index');
var blogRouter = require('./routes/blog');

var app = express();

// Config environment variables. - (.env)
require('dotenv').config({ path: path.join(__dirname, '/configs/.env') })

// Setup mongoose connection
let mongoose = require('mongoose')
let mongoDB = process.env.MONGODB_URI || process.env.DEV_DB_URL // DB config
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }) // Connect to Mongo
  .then(() => console.log('MongoDB Conected...'))
let db = mongoose.connection
// __Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// Connect Flash
app.use(flash());

// Global vars for flash messages.
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
}) 

// Config passport 
require('./configs/config_passport')(passport)

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
