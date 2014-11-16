'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

// this will become middleware
module.exports = function(passport) {

passport.use('basic', new BasicStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.findOne({'basic.email': email}, function (err, user) {
      if (err) {
        console.log('server login error');
        return done('server error');
      }
      if (!user) {
        console.log('no user by that name');
        return done('access error: no user by that name.');
      }
      if (!user.validPassword(password)) {
        console.log('invalid password attempt');
        return done('access error: invalid pass');
      }

      return done(null, user); // null if no error, send to req
      // is good?  req.user gets set to this user by passport : or not
    });
  }));
};

// another example
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));
