var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //to store the authentication strategies that we will configure
var User = require('./models/user');

//next line is used in users.js (?)
passport.use(new LocalStrategy(User.authenticate())); //if we dont use User.authenticate() function from passport-local-mongoose, we have to write our own authenticate function

//next 2 lines are used in app.js (?)
passport.serializeUser(User.serializeUser()); //this and next line will taken care of what ever support needed for sessions
passport.deserializeUser(User.deserializeUser());