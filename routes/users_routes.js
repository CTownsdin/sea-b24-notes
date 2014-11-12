'use strict';
var User = require('../models/user');

module.exports = function (app, passport) {
    // get to signin                {session: false} = don't assume browser! don't set browser cookies please
    app.get('/api/users', passport.authenticate('basic', {session: false}), function (req, res) {
            res.json({'jwt': req.user.generateToken(app.get('jwtSecret'))});

    });
    // post route
    app.post('/api/users', function (req, res) {
        User.findOne({'email': req.body.email}, function (err, user) {
            if (err) { return res.status(500).send('server error'); }
            if (user) { return res.status(500).send('cannot create that user'); }

            // create new
            var newUser = new User();
            newUser.basic.email = req.body.email;
            newUser.basic.password = newUser.generateHash(req.body.password);
            // TODO  -  CHECK for password and password confirmation before creating this user.
            // check that the two entered passwords MATCH !  :)
            newUser.save(function (err, data) {
                if (err) return res.status(500).send('server error');
                res.json({'jwt': newUser.generateToken(app.get('jwtSecret'))})
            })
        })
    });
};
