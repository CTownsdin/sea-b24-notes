'use strict';

var User = require('../models/user');
var jwt = require('jwt-simple');


module.exports = function (secret) {
  return function (req, res, next) {		// function returns a function
    var token = req.headers.jwt || req.body.jwt;

    var decoded;
    try {
      decoded = jwt.decode(token, secret);
    } catch (err) {
      console.log(err);
      res.status(403).send('access denied');
    }

    if (Date.now() > decoded.expireDate) {
      return res.status(403).send('pass expired, please login again');
    }

    User.findOne({ _id: decoded.iss }, function (err, user) {
      if (err) return res.status(403).send('access denied');
      if (!user) return res.status(403).send('access denied');
      // query the DB // mongoose // token is encrypted vers of JWT, decoded is: iss = user id
      if (decoded.admin) {
        console.log("admin accessed");
      }

      // need to access the user object,
      // so ea user has access to their notes.
      req.user = user; // req is really a JS obj, so defining user here
      //****************
      // req gets passed from middleware to middleware
      // we have JWT
      // ***************
      next();
    });
  };
};
