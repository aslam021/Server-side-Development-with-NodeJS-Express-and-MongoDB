const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
      type: String,
      default: ''
    },
    lastname: {
      type: String,
      default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);
//above line adds passportLocalMongoose module to User Schema
//so it will take care of username and passwords(we no need to explicilty define type such things)
//and password will be saved as a hashed value and related salt value also will be stored
//and passportLocalMongoose gives us some more methods.
//and session things also taken care by this passportLocalMongoose module(done in authenticate.js).

module.exports = mongoose.model('User', User);