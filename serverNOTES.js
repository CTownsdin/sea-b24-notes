'use strict';
var express = require('express');
// express:  web app'n framework
var mongoose = require('mongoose');
// mongodb:  object modeling helper, for node.js
var bodyparser = require('body-parser');
// bodyparser:  is request.body parsing middleware
var passport = require('passport');
var app = express();

// get the url
var url = process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/notes-development';
// connect to it
mongoose.connect(url);

// We are expecting a request POST.
// The server will accept this request POST, and bodyparser will allow us
// to read and parse the body of the request POST.
app.use(bodyparser.json());
// application settings, basically setting a var in a different way !
app.set('jwtsecret', process.env.JWT_SECRET || 'Change THIS or DIE!!!');  // !

// Setup passport middleware
// initialize passport
app.use(passport.initialize());
// start the ./lib/passport exported function with passport passed into it.
require('./lib/passport')(passport);  // -> passport.use(new Basic Strategy)
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));

// notesRouter
var notesRouter = express.Router();
notesRouter.use(jwtauth);

// adminRouter
var adminRouter = express.Router();
adminRouter.use(jwtauth);

// usersRouter
var usersRouter = express.Router();
usersRouter.use(jwtauth);

require('./routes/notes_routes')(app);
require('./routes/admin_routes')(app, passport);
require('./routes/users_routes')(app, passport);

app.use('/v1', notesRouter);

// DO THIS FOR AUTH ASSIGNMENT
// could make a router and mount it on the app
// router for /admin
// router for /users
// etc, within each router, mount router.use(function(req, res, next){ // logic; next();})


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
