'use strict';
var user = require(../ user)
var jwt - require(.. / jwt auth)

module.exports = function (secret) {  // just pull in the secret
    return function (req, res, next) {
        var token = req.headers.jwt || req.body.jwt;

        var decoded;
        try {
            decoded = jwt.decode(token, secret);  // js object
        } catch(err) {
            console.log(err);       // tends to be a kludge for bad code :O
            res.status(403).send('access denied');        // jwt simple does not support cb, hence t/c
                                // jwt doesn't exit or was invalid, 403 unauth'd
        }

        User.findOne({_id: decoded.iss}, function (err, user) {
            // mongoose is pefectly find returning zero data
            if (err) return res.status(403).send('access denied');
            if (!user) return res.status(403).send('access denied');
            // query the DB // mongoose // token is encrypted vers of JWT, decoded is: iss = user id

            // need to access the user object, so ea user has access to their notes.
            req.user = user;    // req is really a JS obj!, defining user here!
            // setting new p with .user
            // req gets passed from mw to mw
            // we have JWT
            next();
        });
    };
};
