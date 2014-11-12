'use strict';
var Admin = require('../models/user');

// http://blog.modulus.io/nodejs-and-express-basic-authentication
module.exports = function (app, passport) {
    var auth = app.basicAuth(function(user, pass, callback){
        var result = (user === 'test' && pass === 'testPass');
        next(null, result);
    });


    app.get('/api/admin', auth, )
};
