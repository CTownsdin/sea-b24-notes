'use strict';
var User = require('../models/user');

module.exports = function(app, passport) {

  app.get('/api/users', passport.authenticate('basic', {
    session: false
  }), function (req, res) {
    res.json({
      'jwt': req.user.generateToken(app.get('jwtSecret'))
    });
  });

  // POST route - used to create a new user.
  app.post('/api/users', function (req, res) {
    User.findOne({ 'basic.email': req.body.email }, function (err, user) {
      if (err) return res.status(500).send('server error');
      // the user already exists!
      if (user) return res.status(500).send('cannot create, that username is taken');

      // do the password check module
      var isPasswordValid = require('../lib/regexpwdcheck')(req.body.password);
      if (!isPasswordValid) return res.status(500).send('check pwd req\'s');
      console.log('new user pwd looks good?: ' + isPasswordValid);

      // create new user
      var newUser = new User();
      newUser.basic.email = req.body.email;
      newUser.basic.password = newUser.generateHash(req.body.password);

      // save newUser
      newUser.save(function (err, data) {
        if (err) return res.status(500).send('server save error');
        res.send({
          'jwt': newUser.generateToken(app.get('jwtSecret'))
        });
      });
    });
  });
};
