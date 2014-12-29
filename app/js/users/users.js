'use strict';

// fill this with exports, then we can require this one thing in.
module.exports = function(app) {
  require('./controllers/users_controller')(app);
};
