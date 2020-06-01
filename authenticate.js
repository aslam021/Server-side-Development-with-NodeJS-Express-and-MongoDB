var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //to store the authentication strategies that we will configure
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

//next line is used in users.js (?)
passport.use(new LocalStrategy(User.authenticate())); //if we dont use User.authenticate() function from passport-local-mongoose, we have to write our own authenticate function

//next 2 lines are used in app.js (?)
passport.serializeUser(User.serializeUser()); //this and next line will taken care of what ever support needed for sessions
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //extract json web token from req header
opts.secretOrKey = config.secretKey;

//json web token passport strategy
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => { //done is a callback provided by passport. it will be used to load information to request message
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false); //done(err, false) => (error, user)
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
//we will use jwt strategy for authentication
//we will not use session here