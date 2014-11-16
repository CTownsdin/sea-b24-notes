'use strict';       // user model
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

// define a mongoose.Schema 'userSchema'
var userSchema = mongoose.Schema({
    basic: {
        email: String,
        password: String,          // saving password hash in here
        isAdmin: false
    }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.basic.password);
};
// this.basic.password - is what came from the db,
// password gets salted/hashed & results compared to the stored hashed pwd

userSchema.methods.generateToken = function (secret) {
    var that = this;
    var token = jwt.encode({
        iss: that._id,
        expireDate: (Date.now() + 43200000)       // 12 hr expireDate
    }, secret);
    console.log('returning a token');
    return token;
};

// export the mongoose 'User' model
module.exports = mongoose.model('User', userSchema);
