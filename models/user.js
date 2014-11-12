'use strict';       // user model
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var userSchema = mongoose.Schema({
    basic: {
        email: String,
        password: String          // saving password hash in here
    }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.basic.password);
};
// this.basic.password - is what came from the db, password gets salted/hashed & compared

userSchema.methods.generateToken = function (secret) {
    var self = this;    // aka That = This;
    var token = jwt.encode({
        iss: self._id
    }, secret);
    return token;
};

module.exports = mongoose.model('User', userSchema);
