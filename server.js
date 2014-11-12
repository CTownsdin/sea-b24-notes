var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var passport = require('passport');
var app = express();

var url = process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/notes-development';
mongoose.connect(url);

// Create a middleware that will verify a user is admin and reject tokens that have expired in jwtauth

require('./routes/notes_routes')(app);

// Authenticator
app.use(express.basicAuth(function(user, pass, callback) {
    var result = (user === 'testUser' && pass === 'testPass');
    callback(null /* error */, result);
}));

app.use(bodyparser.json());
app.set('jwtsecret', process.env.JWT_SECRET || 'Change THIS or DIE!!!');  // !

app.use(passport.initialize());
require('./lib/passport')(passport);

var notes_router = express.Router();        // useing express 4 router!
notesRouter.use(jwtauth);

require('./routes/users_routes')(app, passport);
require('./routes/notes_routes')(app);
app.use('/', notesRouter);

// can be used for v1 of API
// app.use('/v1', notesRouter);
//

// could make a router and mount it on the app
// router for /admin
// router for /users
// etc, within each router, mount router.use(function(req, res, next){ // logic; next();})

app.use(bodyparser.json());
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
