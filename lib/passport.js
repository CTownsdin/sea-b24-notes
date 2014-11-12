'use strict';
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

module.exports = function (passport) {
    passport.use('basic', new BasicStrategy({       // this will become middleware
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {       // params to BasicStrategy
        User.findOne({'basic.email': email}, function (err, user) {
            if (err) { return done('server error'); }
            if (!user) { return done('access error'); }
            if (!user.validPassword(password)) { return done('access error'); }

            return done(null, user);    // null if no error, send to req
            // is good?  req.user gets set to this user by passport
        });
    }));
};
