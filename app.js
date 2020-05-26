var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var authenticate = require('./authenticate');

const mongoos = require('mongoose');


const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoos.connect(url);

connect.then((db)=>{
  console.log("Connected correctly to server");
}, (err) =>  { console.log(err); });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser('12345-67890-09876-54321')); //setting a secret key for create signed cookies
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session()); 
//app.use(passport.session()) will serialize the user information of the req message and store it in the session
//and if a request coming from the client with the session cookie it will automatically load the user information to the request 

app.use('/', indexRouter);
app.use('/users', usersRouter);

//so here we authenticate the user before giving access to any of the resources
function auth (req, res, next) {  //(req, res, next) will go through each of this middlewares in order (.use)
  console.log(req.user);

  if (!req.user) { //if user has authenticated successfuly a user property would be added to req by passport
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
    next();
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

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
